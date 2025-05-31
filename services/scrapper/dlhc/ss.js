import puppeteer from "puppeteer";
import path from "path";
import logger from "../../../util/logger/logger.js";
import fs from "fs-extra";
import os from "os";
import scrapperResponseMapper from "../mappers/scrapperResponseMapper.js";

class DlhcScrapper {
    constructor() {
        this.baseUrl = 'https://delhihighcourt.nic.in/';
        this.maxRetries = 1;
    }

    async getCaseData(caseType, caseNumber, caseYear) {
        let browser;
        let attempt = 0;

        while (attempt < this.maxRetries) {
            try {
                if (os.platform() === "darwin") {
                    browser = await puppeteer.launch({
                        headless: false,
                        args: ["--window-size=1920x1080"],
                        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                    });
                } else {
                    browser = await puppeteer.launch({
                        headless: false,
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
                logger.info(`Attempt ${attempt + 1} of ${this.maxRetries} for Case: ${caseType}-${caseNumber}-${caseYear}`);

                await page.goto(`${this.baseUrl}/app/get-case-type-status#`, { waitUntil: 'networkidle2' });

                await page.select('select[name="case_type"]', caseType);
                await page.type('input[name="case_number"]', caseNumber);
                await page.select('select[name="case_year"]', caseYear);

                const captchaValue = await page.evaluate(() => {
                    const captchaSpan = document.querySelector('#captcha-code');
                    return captchaSpan ? captchaSpan.textContent.trim() : null;
                });
                await page.type('input[name="captchaInput"]', captchaValue);

                await Promise.all([
                    page.click('#search'),
                    page.waitForResponse(response => response.url().includes('get-case-type-status')),
                ]);

                await page.waitForSelector('#caseTable tbody tr', { timeout: 10000 });

                const ordersLink = await page.waitForSelector('a[style*="color:blue"][style*="text-decoration: underline"]:has(strong)', {
                    timeout: 5000
                });

                if (!ordersLink) {
                    logger.info('No orders link found');
                    return scrapperResponseMapper.getErrorResponse('DLHC', 'No orders available');
                }

                const petitionerVsRespondent = await page.evaluate(() => {
                    const row = document.querySelector('#caseTable tbody tr');
                    const petitionerVsRespondentCell = row ? row.querySelector('td:nth-child(3)') : null;
                    const listingDateCell = row ? row.querySelector('td:nth-child(4)') : null;
                    return {
                        parties: petitionerVsRespondentCell ? petitionerVsRespondentCell.textContent.trim() : null,
                        listingInfo: listingDateCell ? listingDateCell.textContent.trim() : null
                    };
                });

                const { parties, listingInfo } = petitionerVsRespondent;
                const [petitioner, respondent] = parties.split('VS.').map(text => text.trim());
                
                // Parse listing date and court info
                const nextDateMatch = listingInfo.match(/NEXT DATE: (\d{2}\/\d{2}\/\d{4})/);
                const lastDateMatch = listingInfo.match(/Last Date: (\d{2}\/\d{2}\/\d{4})/);
                const courtNoMatch = listingInfo.match(/COURT NO:(\d+)/);

                const listingDate = {
                    nextDate: nextDateMatch ? nextDateMatch[1] : null,
                    lastDate: lastDateMatch ? lastDateMatch[1] : null,
                    courtNo: courtNoMatch ? courtNoMatch[1] : null
                };

                const ordersUrl = await page.evaluate(link => link.href, ordersLink);

                const ordersPage = await browser.newPage();
                await ordersPage.goto(ordersUrl, { waitUntil: 'networkidle2' });

                const ordersData = await this.extractOrdersData(ordersPage);
                ordersData = {
                    ...ordersData,
                    parties: {
                        petitioner,
                        respondent
                    },
                    listingDate
                }
                
                await ordersPage.close();

                await browser.close();

                console.log("ordersData", ordersData);

                return scrapperResponseMapper.mapDlhcResponse(ordersData);

            } catch (error) {
                logger.error('Error processing case:', error);
                if (browser) {
                    try {
                        await browser.close();
                    } catch (closeError) {
                        logger.error('Error closing browser:', closeError);
                    }
                }

                if (attempt === this.maxRetries - 1) {
                    return scrapperResponseMapper.getErrorResponse('DLHC', 'Failed to fetch case data after max retries');
                }

                attempt++;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }

    async extractOrdersData(page) {
        try {
            await page.waitForSelector('#caseTable', { timeout: 5000 });

            await page.select('select[name="caseTable_length"]', '-1');
            
            await page.waitForFunction(() => {
                const info = document.querySelector('#caseTable_info');
                return info && info.textContent.includes('Showing') && 
                       document.querySelector('#caseTable_processing').style.display === 'none';
            }, { timeout: 10000 });
            
            const ordersData = await page.evaluate(() => {
                const rows = Array.from(document.querySelectorAll('#caseTable tbody tr'));
                return rows.map(row => {
                    const columns = row.querySelectorAll('td');
                    const orderLink = columns[1].querySelector('a');
                    
                    return {
                        serialNo: columns[0].textContent.trim(),
                        caseNo: columns[1].textContent.trim(),
                        orderLink: orderLink && orderLink.href !== 'javascript:void(0)' ? orderLink.href : null,
                        orderDate: columns[2].textContent.trim(),
                        corrigendumLink: columns[3].textContent.trim() || null,
                        hindiOrder: columns[4].textContent.trim() || null
                    };
                });
            });

            return {
                totalOrders: ordersData.length,
                orders: ordersData
            };

        } catch (error) {
            logger.error('Error extracting orders data:', error);
            throw error;
        }
    }
}

export default new DlhcScrapper();
