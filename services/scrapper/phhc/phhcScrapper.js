import puppeteer from "puppeteer";
import path from "path";
import logger from "../../../util/logger/logger.js";
import fs from "fs-extra";
import os from "os";
import scrapperResponseMapper from "../mappers/scrapperResponseMapper.js";

class PhhcScrapper {
    constructor() {
        this.baseUrl = 'https://phhc.gov.in';
        this.maxRetries = 1;
    }


    async extractCaseDetails(page) {
        try {
            return await page.evaluate(() => {
                const getText = (el) => (el ? el.textContent.trim() : '');

                // Find the main table - assuming #table1 is the main table as per your HTML
                const table = document.querySelector('#table1');
                if (!table) {
                    return { error: 'Main case details table not found' };
                }

                const rows = Array.from(table.querySelectorAll('tr'));

                const caseDetails = {};
                const relatedCases = [];
                const caseListing = [];
                const copyPetitions = [];
                const appeals = [];
                const judgments = [];

                for (let i = 0; i < rows.length; i++) {
                    const cells = rows[i].querySelectorAll('td, th');

                    if (cells.length === 4) {
                        const header = getText(cells[0]);
                        switch (header) {
                            case 'Diary Number':
                                caseDetails.diaryNumber = getText(cells[1]);
                                caseDetails.registrationDate = getText(cells[3]);
                                break;
                            case 'Category':
                                caseDetails.category = getText(cells[1]);
                                caseDetails.mainCaseDetail = getText(cells[3]);
                                break;
                            case 'Party Detail':
                                caseDetails.partyDetail = getText(cells[1]);
                                caseDetails.district = getText(cells[3]);
                                break;
                            case 'Advocate Name':
                                caseDetails.advocateName = getText(cells[1]);
                                caseDetails.listType = getText(cells[3]);
                                break;
                            case 'Status':
                                // Status row with colspan=3, concatenate all cells except header
                                caseDetails.status = getText(cells[1]) + (cells[2] ? ' ' + getText(cells[2]) : '') + (cells[3] ? ' ' + getText(cells[3]) : '');
                                break;
                        }
                    }

                    // Related Cases / Miscellaneous Applications
                    if (rows[i].querySelector('th') && rows[i].querySelector('th').textContent.includes('Related Cases')) {
                        let j = i + 1;
                        while (j < rows.length && rows[j].querySelectorAll('td').length > 0 && !rows[j].querySelector('th')) {
                            const tds = rows[j].querySelectorAll('td');
                            if (tds.length >= 2) {
                                relatedCases.push({
                                    caseNo: tds[0].innerText.trim(),
                                    link: tds[0].querySelector('a')?.href || null,
                                    description: tds[1].innerText.trim(),
                                });
                            }
                            j++;
                        }
                    }

                    // Case Listing Details
                    if (rows[i].querySelector('th') && rows[i].querySelector('th').textContent.includes('Case Listing Details')) {
                        let j = i + 2; // skip header + column row
                        while (j < rows.length && rows[j].querySelectorAll('td').length > 0 && !rows[j].querySelector('th')) {
                            const tds = rows[j].querySelectorAll('td');
                            if (tds.length >= 3) {
                                caseListing.push({
                                    causeListDate: getText(tds[0]),
                                    listTypeSrNo: getText(tds[1]),
                                    bench: getText(tds[2]),
                                });
                            }
                            j++;
                        }
                    }

                    // Copy Petition Details
                    if (rows[i].querySelector('th') && rows[i].querySelector('th').textContent.includes('Copy Petition Applied')) {
                        let j = i + 2; // skip header + column row
                        while (j < rows.length && rows[j].querySelectorAll('td').length > 0 && !rows[j].querySelector('th')) {
                            const tds = rows[j].querySelectorAll('td');
                            if (tds.length >= 4) {
                                copyPetitions.push({
                                    petitionTypeNo: getText(tds[0]),
                                    petitionDate: getText(tds[1]),
                                    appliedBy: getText(tds[2]),
                                    petitionStatus: getText(tds[3]),
                                });
                            }
                            j++;
                        }
                    }

                    // Appeals Details
                    if (rows[i].querySelector('th') && rows[i].querySelector('th').textContent.includes('Detail of Appeals')) {
                        let j = i + 2;
                        while (j < rows.length && rows[j].querySelectorAll('td').length > 0 && !rows[j].querySelector('th')) {
                            const tds = rows[j].querySelectorAll('td');
                            if (tds.length >= 4) {
                                appeals.push({
                                    caseId: getText(tds[0]),
                                    partyName: getText(tds[1]),
                                    status: getText(tds[2]),
                                    detailLink: tds[3].querySelector('a')?.href || null,
                                });
                            }
                            j++;
                        }
                    }

                    // Judgment Details
                    if (rows[i].querySelector('th') && rows[i].querySelector('th').textContent.includes('Judgment Details')) {
                        let j = i + 2;
                        while (j < rows.length && rows[j].querySelectorAll('td').length > 0 && !rows[j].querySelector('th')) {
                            const tds = rows[j].querySelectorAll('td');
                            if (tds.length >= 4) {
                                judgments.push({
                                    orderDate: getText(tds[0]),
                                    orderCaseId: getText(tds[1]),
                                    bench: getText(tds[2]),
                                    judgmentLink: tds[3].querySelector('a')?.href || null,
                                });
                            }
                            j++;
                        }
                    }
                }

                return {
                    caseDetails,
                    relatedCases,
                    caseListing,
                    copyPetitions,
                    appeals,
                    judgments,
                };
            });
        } catch (error) {
            logger.error('Error extracting case details:', error);
            throw Error('Error extracting case details');
        }
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
                      executablePath:
                        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // for macOS
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

                await page.goto(`${this.baseUrl}/home.php?search_param=case`, { waitUntil: 'networkidle2' });

                await page.select('select[name="t_case_type"]', caseType);
                await page.type('input[name="t_case_no"]', caseNumber);
                await page.select('select[name="t_case_year"]', caseYear);

                await page.click('input[type="submit"]');
                logger.info('clicked submit');
                await page.waitForNavigation({ waitUntil: 'networkidle2' });

                const expectedLinkText = `${caseType}-${caseNumber}-${caseYear}`;

                await page.waitForFunction((linkText) => {
                    return Array.from(document.querySelectorAll('a')).some(a => a.textContent.trim() === linkText);
                }, { timeout: 10000 }, expectedLinkText);

                const href = await page.evaluate((expectedLinkText) => {
                    const anchors = Array.from(document.querySelectorAll('a'));
                    const link = anchors.find(a => a.textContent.includes(expectedLinkText));
                    return link ? link.href : null;
                }, expectedLinkText);

                if (href) {
                    await page.goto(href, { waitUntil: 'networkidle2' });
                } else {
                    logger.error("Case link not found on the results page.");
                    throw new Error("Case link not found");
                }

                const rawCaseDetails = await this.extractCaseDetails(page);
                await browser.close();

                // Map the response to standard format
                return scrapperResponseMapper.mapPhhcResponse(rawCaseDetails);

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
                    return scrapperResponseMapper.getErrorResponse('PHHC', 'Failed to fetch case data after max retries');
                }

                attempt++;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
}

export default new PhhcScrapper();
