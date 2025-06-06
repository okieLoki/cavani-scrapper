import puppeteer from "puppeteer";
import path from "path";
import logger from "../../../util/logger/logger.js";
import captchaSolverService from "../../captcha-solver/captchaSolverService.js";
import fs from "fs-extra";
import os from "os";
import scrapperResponseMapper from "../mappers/scrapperResponseMapper.js";

class EservicesScrapper {
  constructor() {
    this.baseUrl = "https://services.ecourts.gov.in/ecourtindia_v6/";
    this.maxRetries = 3;
    this.imagesDir = path.join(process.cwd(), "images");
  }

  async ensureImagesDirectory() {
    try {
      await fs.ensureDir(this.imagesDir);
    } catch (error) {
      logger.error("Error creating images directory:", error);
      throw Error("Error creating images directory");
    }
  }

  async cleanupImages() {
    try {
      await fs.emptyDir(this.imagesDir);
    } catch (error) {
      logger.error("Error cleaning up images directory:", error);
      throw Error("Error cleaning up images directory");
    }
  }

  async extractCaseDetails(page) {
    try {
      return await page.evaluate(() => {
        const getText = (selector) => {
          const element = document.querySelector(selector);
          return element ? element.textContent.trim() : "";
        };

        const getTableData = (tableSelector) => {
          const rows = document.querySelectorAll(`${tableSelector} tbody tr`);
          const data = {};
          rows.forEach((row) => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 2) {
              const key = cells[0].textContent.trim().replace(/[:\s]+$/, "");
              const value = cells[1].textContent.trim();
              if (key && value) {
                data[key] = value;
              }
            }
          });
          return data;
        };

        const getHistoryData = () => {
          const rows = document.querySelectorAll(".history_table tbody tr");
          return Array.from(rows).map((row) => {
            const cells = row.querySelectorAll("td");
            return {
              judge: cells[0]?.textContent.trim(),
              businessDate: cells[1]?.textContent.trim(),
              hearingDate: cells[2]?.textContent.trim(),
              purpose: cells[3]?.textContent.trim(),
            };
          });
        };

        const getOrdersData = () => {
          const rows = document.querySelectorAll(".order_table tbody tr");
          return Array.from(rows)
            .slice(1)
            .map((row) => {
              const cells = row.querySelectorAll("td");
              return {
                orderNumber: cells[0]?.textContent.trim(),
                orderDate: cells[1]?.textContent.trim(),
                orderDetails: cells[2]?.textContent.trim(),
              };
            });
        };

        const getPetitionerData = () => {
          const rows = document.querySelectorAll(
            ".Petitioner_Advocate_table tbody tr"
          );
          return Array.from(rows).map((row) => row.textContent.trim());
        };

        const getRespondentData = () => {
          const rows = document.querySelectorAll(
            ".Respondent_Advocate_table tbody tr"
          );
          return Array.from(rows).map((row) => row.textContent.trim());
        };

        const getActsData = () => {
          const rows = document.querySelectorAll("#act_table tbody tr");
          const acts = [];
          rows.forEach((row) => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 2) {
              acts.push({
                act: cells[0]?.textContent.trim(),
                section: cells[1]?.textContent.trim(),
              });
            }
          });
          return acts;
        };

        return {
          courtName: getText("#chHeading"),
          caseDetails: getTableData(".case_details_table"),
          caseStatus: getTableData(".case_status_table"),
          petitioner: getPetitionerData(),
          respondent: getRespondentData(),
          acts: getActsData(),
          caseHistory: getHistoryData(),
          orders: getOrdersData(),
        };
      });
    } catch (error) {
      logger.error("Error extracting case details:", error);
      throw Error("Error extracting case details: " + error);
    }
  }

  async getCaseData(cnrNumber) {
    let browser;
    let attempt = 0;

    while (attempt < this.maxRetries) {
      try {
        await this.ensureImagesDirectory();

        if (os.platform() === "darwin") {
          browser = await puppeteer.launch({
            headless: true,
            args: ["--window-size=1920x1080"],
            executablePath:
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // for macOS
          });
        } else {
          browser = await puppeteer.launch({
            headless: true,
            args: [
              "--no-sandbox",
              "--disable-setuid-sandbox",
              "--disable-dev-shm-usage",
              "--disable-accelerated-2d-canvas",
              "--disable-gpu",
              "--window-size=1920x1080",
            ],
            defaultViewport: null,
            ignoreHTTPSErrors: true,
          });
        }

        const page = await browser.newPage();

        logger.info(
          `Attempt ${attempt + 1} of ${this.maxRetries} for CNR: ${cnrNumber}`
        );

        try {
          await page.goto(this.baseUrl, { waitUntil: "networkidle2" });
          await page.waitForSelector("#captcha_image");

          await new Promise((resolve) => setTimeout(resolve, 2000));

          const imageName =
            Math.random().toString(36).substring(2, 15) +
            "_" +
            Date.now() +
            ".png";

          const captchaElement = await page.$("#captcha_image");
          const rawImagePath = path.join(
            this.imagesDir,
            `captcha_raw_${imageName}.png`
          );
          const processedImagePath = path.join(
            this.imagesDir,
            `captcha_processed_${imageName}.png`
          );

          await captchaElement.screenshot({ path: rawImagePath });
          await captchaSolverService.preprocessCaptcha(
            rawImagePath,
            processedImagePath
          );
          const captchaText = await captchaSolverService.solveCaptcha(
            processedImagePath
          );

          console.log(captchaText);

          await fs.remove(rawImagePath);
          await fs.remove(processedImagePath);

          await page.type("#cino", cnrNumber);
          await page.type("#fcaptcha_code", captchaText);
          await page.click("#searchbtn");

          await new Promise((resolve) => setTimeout(resolve, 2000));

          const hasInvalidCaptchaError = await page.evaluate(() => {
            const errorElement = document.querySelector('.alert-danger-cust');
            return errorElement && errorElement.textContent.trim().includes('Invalid Captcha');
          });

          if (hasInvalidCaptchaError) {
            logger.info('Invalid captcha detected in error modal. Retrying...');
            throw new Error('Invalid captcha error: ' + hasInvalidCaptchaError);
          }

          const isTableVisible = await page.evaluate(() => {
            const table = document.querySelector("#history_cnr");
            return table && table.offsetParent !== null;
          });

          if (!isTableVisible) {
            logger.info(
              "Table not found after captcha submission - likely invalid captcha. Retrying..."
            );
            throw new Error("Invalid captcha or submission error: " + isTableVisible);
          }

          await page.waitForSelector("#history_cnr", { timeout: 30000 });
          await page.waitForFunction(
            () => {
              const container = document.querySelector("#history_cnr");
              return container && container.textContent.length > 0;
            },
            { timeout: 30000 }
          );

          await new Promise((resolve) => setTimeout(resolve, 2000));

          const rawCaseDetails = await this.extractCaseDetails(page);
          await browser.close();
          await this.cleanupImages();
          
          // Map the response to standard format
          return scrapperResponseMapper.mapEservicesResponse(rawCaseDetails);

        } catch (error) {
          logger.error("Error processing CNR:", error);
          throw Error(`Error processing CNR ${cnrNumber}: ${error}`);
        }
      } catch (error) {
        if (browser) {
          try {
            await browser.close();
          } catch (closeError) {
            logger.error("Error closing browser:", closeError);
          }
        }
        await this.cleanupImages();

        if (attempt === this.maxRetries - 1) {
          return scrapperResponseMapper.getErrorResponse('eServices', 'Failed to fetch case data after max retries');
        }

        attempt++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }
}

export default new EservicesScrapper();
