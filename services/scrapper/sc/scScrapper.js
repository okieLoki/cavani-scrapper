// import puppeteer from "puppeteer";
// import path from "path";
// import logger from "../../../util/logger/logger.js";
// import fs from "fs-extra";
// import axios from "axios";
// import {setTimeout} from "node:timers/promises";
//
// class ScScrapper {
//     constructor() {
//         this.baseUrl = 'https://www.sci.gov.in';
//         this.maxRetries = 2;
//     }
//
//     async extractCaseDetails(page) {
//         try {
//             const rawData = await page.evaluate(() => {
//                 const getTextFromRow = (label) => {
//                     const rows = document.querySelectorAll('.caseDetailsTable tbody tr');
//                     for (let row of rows) {
//                         const th = row.querySelector('td:first-child');
//                         const td = row.querySelector('td:last-child');
//                         if (th && td && th.textContent.trim().toLowerCase().includes(label.toLowerCase())) {
//                             return td.innerText.trim().replace(/\s+/g, ' ');
//                         }
//                     }
//                     return '';
//                 };
//
//                 const getCaseTitle = () => {
//                     const h4 = document.querySelector('#cnrResultsDetails h4');
//                     return h4 ? h4.textContent.trim() : '';
//                 };
//
//                 return {
//                     diaryNumber: getTextFromRow('Diary Number'),
//                     caseNumber: getTextFromRow('Case Number'),
//                     cnrNumber: getTextFromRow('CNR Number'),
//                     statusStage: getTextFromRow('Status/Stage'),
//                     lastListedOn: getTextFromRow('Present/Last Listed On'),
//                     admittedOn: getTextFromRow('Admitted'),
//                     category: getTextFromRow('Category'),
//                     petitioner: getTextFromRow('Petitioner(s)'),
//                     respondent: getTextFromRow('Respondent(s)'),
//                     petitionerAdvocates: getTextFromRow('Petitioner Advocate(s)'),
//                     respondentAdvocates: getTextFromRow('Respondent Advocate(s)'),
//                     impleaderAdvocates: getTextFromRow('Impleaders Advocate(s)'),
//                     caseTitle: getCaseTitle()
//                 };
//             });
//             logger.info('extracted case details',rawData);
//
//             // Split helper based on leading numbers (like "1.", "1.1", etc.)
//             const splitByNumbering = (text) => {
//                 return text
//                     .split(/(?:\s|^)(\d+(?:\.\d+)?)(?=\s)/) // split on leading numbered entries
//                     .map(part => part.trim())
//                     .filter(entry => entry && !/^\d/.test(entry)); // remove numbers
//             };
//
//             // Split by comma helper
//             const splitByComma = (text) => {
//                 return text
//                     .split(',')
//                     .map(part => part.trim())
//                     .filter(Boolean);
//             };
//
//             // Transform into structured list
//             return {
//                 ...rawData,
//                 category: rawData.category,
//                 petitioners: splitByNumbering(rawData.petitioner),
//                 respondents: splitByNumbering(rawData.respondent),
//                 petitionerAdvocates: splitByComma(rawData.petitionerAdvocates),
//                 respondentAdvocates: splitByComma(rawData.respondentAdvocates),
//                 impleaderAdvocates: splitByComma(rawData.impleaderAdvocates)
//             };
//
//         } catch (error) {
//             console.error('Error extracting structured case details:', error);
//             throw new Error('Failed to extract details from the case details table');
//         }
//     }
//
//
//     async extractEarlierCourtDetails(page) {
//         try {
//
//             const button = await page.$('text=Earlier Court Details');
//             await button.evaluate(el => el.scrollIntoView());
//             await button.click();
//
//
//             logger.info('clicked earlier court details');
//
//             // Wait for the first row to appear after data loads
//             await page.waitForSelector('td[data-th="S.No."] span.bt-content');
//
//             // Extract the data
//             const details = await page.evaluate(() => {
//                 const rows = document.querySelectorAll('table.bt tbody tr');
//                 const result = [];
//
//
//                 for (const row of rows) {
//                     const getText = (selector) => {
//                         const cell = row.querySelector(`td[data-th="${selector}"] span.bt-content`);
//                         return cell ? cell.textContent.trim().replace(/\s+/g, ' ') : '';
//                     };
//
//                     const entry = {
//                         sno: getText("S.No."),
//                         court: getText("Court"),
//                         agencyState: getText("Agency State"),
//                         agencyCode: getText("Agency Code"),
//                         caseNo: getText("Case No."),
//                         orderDate: getText("Order Date"),
//                         cnrOrDesignation: getText("CNR No. / Designation"),
//                         crimeNoOrYear: getText("Crime No./ Year"),
//                         authorityOrOrderNo: getText("Authority / Organisation / Impugned Order No."),
//                         judgmentChallenged: getText("Judgment Challenged"),
//                         judgmentType: getText("Judgment Type"),
//                         referenceCourt: getText("Reference court / State / District / No."),
//                         reliedUponCourt: getText("Relied Upon court / State / District / No."),
//                         transferTo: getText("Transfer To State / District / No."),
//                         govtNotification: getText("Government Notification State / No. /  Date")
//                     };
//
//                     // Only include if "sno" (or any other field) is not empty
//                     if (entry.sno.trim() !== '') {
//                         result.push(entry);
//                     }
//                 }
//
//                 return result;
//             });
//
//             return details;
//         } catch (err) {
//             console.error('Error extracting Earlier Court Details:', err);
//             throw new Error('Failed to extract Earlier Court Details');
//         }
//     }
//
//     async extractTaggedMattersDetails(page) {
//         try {
//             // Ensure the "Tagged Matters" section is expanded
//
//
//             const button = await page.$('text=Tagged Matters');
//             await button.evaluate(el => el.scrollIntoView());
//             await button.click();
//             // Wait for the nested case rows to appear
//             await page.waitForSelector('td[data-th="Type"]');
//
//             // Evaluate the page to extract structured info
//             const details = await page.evaluate(() => {
//                 const rows = document.querySelectorAll('table.caseDetailsTable.tagged_matters table tbody tr');
//                 const result = [];
//
//                 for (const row of rows) {
//                     const getText = (selector) => {
//                         const cell = row.querySelector(`td[data-th="${selector}"] span.bt-content`);
//                         return cell ? cell.textContent.trim().replace(/\s+/g, ' ') : '';
//                     };
//
//                     const entry = {
//                         type: getText("Type"),
//                         caseNumber: getText("Case Number"),
//                         petitionerVsRespondent: getText("Petitioner vs. Respondent"),
//                         list: getText("List"),
//                         status: getText("Status"),
//                         statutoryInfo: getText("Stat. Info."),
//                         ia: getText("IA"),
//                         entryDate: getText("Entry Date")
//                     };
//
//                     if (entry.caseNumber) {
//                         result.push(entry);
//                     }
//                 }
//
//                 return result;
//             });
//
//             return details;
//         } catch (err) {
//             console.error('Error extracting Tagged Matters details:', err);
//             throw new Error('Failed to extract Tagged Matters details');
//         }
//     }
//
//     async extractJudgementOrdersDetails(page) {
//         try {
//             // Ensure the "Judgement/Orders" section is expanded
//
//             const button = await page.$('text=Judgement/Orders');
//             await button.evaluate(el => el.scrollIntoView());
//             await button.click();
//             await page.waitForSelector('table.caseDetailsTable.judgement_orders tbody tr td a');
//
//             const orders = await page.evaluate(() => {
//                 const rows = document.querySelectorAll(
//                     'table.caseDetailsTable.judgement_orders tbody tr'
//                 );
//                 const result = [];
//
//                 for (const row of rows) {
//                     const link = row.querySelector('a');
//                     // logger.info(link);
//                     if (link) {
//                         const date = link.textContent.trim();
//                         const href = link.href;
//                         const matched = link.text.match(/\[(.*?)\]/);
//                         // const typeMatch = matched ? matched[1].trim() : "";
//                         result.push({
//                             date,
//                             link: href,
//                             // type: typeMatch || 'Unknown'
//                         });
//                     }
//                 }
//
//                 return result;
//             });
//
//             return orders;
//         } catch (err) {
//             console.error('Error extracting Judgement/Orders details:', err);
//             throw new Error('Failed to extract Judgement/Orders details');
//         }
//     }
//
//
//     async extractNoticesDetails(page) {
//         try {
//             // Click the Notices section if it's not already expanded
//
//             const button = await page.$('table.caseDetailsTable.notices > thead button');
//             if (button) {
//                 await button.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
//                 await button.click();
//             } else {
//                 throw new Error('Button not found!');
//             }
//
//
//             // Wait for nested rows inside the Notices table
//             await page.waitForSelector('td[data-th="Name"]');
//
//             const details = await page.evaluate(() => {
//                 const rows = document.querySelectorAll('table.caseDetailsTable.notices table tbody tr');
//                 const result = [];
//
//                 for (const row of rows) {
//                     const getText = (header) => {
//                         const cell = row.querySelector(`td[data-th="${header}"] span.bt-content`);
//                         return cell ? cell.textContent.trim().replace(/\s+/g, ' ') : '';
//                     };
//
//                     const entry = {
//                         serialNumber: getText('Serial Number'),
//                         processId: getText('Process Id'),
//                         noticeType: getText('Notice Type'),
//                         name: getText('Name'),
//                         stateDistrict: getText('State / District'),
//                         station: getText('Station'), // Note: May be blank
//                         issueDate: getText('Issue Date'),
//                         returnableDate: getText('Returnable Date'),
//                         dispatchDate: getText('Dispatch Date') // Also may be blank
//                     };
//
//                     if (entry.processId) {
//                         result.push(entry);
//                     }
//                 }
//
//                 return result;
//             });
//
//             return details;
//         } catch (err) {
//             console.error('Error extracting Notices details:', err);
//             throw new Error('Failed to extract Notices details');
//         }
//     }
//
//
//
//
//     async getCaseData(caseType, caseNumber, caseYear) {
//         let browser;
//         let attempt = 0;
//
//         async function selectDropdownViaKeyboard(page, formRowClass, optionText) {
//             // Locate the container (e.g., form-row.case_type or form-row.case_year)
//             const containerHandle = await page.$(`div.form-row.${formRowClass}`);
//             if (!containerHandle) throw new Error(`Dropdown with class '${formRowClass}' not found.`);
//
//             // Find and click the select2 dropdown inside it
//             const dropdownHandle = await containerHandle.$('.select2-selection__arrow');
//             await dropdownHandle.click();
//
//             // Wait for the search input inside the Select2 dropdown to appear
//             await page.waitForSelector('input.select2-search__field');
//
//             // Type the desired text
//             await page.type('input.select2-search__field', optionText);
//
//             // Wait a bit to allow options to populate
//             // await page.waitForTimeout(500); // adjust if needed
//
//             // Press Enter to select the top matching result
//             await page.keyboard.press('Enter');
//         }
//
//
//         while (attempt < this.maxRetries) {
//             try {
//                 // browser = await puppeteer.launch({
//                 //     headless: false,
//                 //     args:['--window-size=1920x1080'],
//                 //     executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' // for macOS
//                 // });
//                 browser = await puppeteer.launch({
//                     headless: false,
//                     args: [
//                         '--no-sandbox',
//                         '--disable-setuid-sandbox',
//                         '--disable-dev-shm-usage',
//                         '--disable-accelerated-2d-canvas',
//                         '--disable-gpu',
//                         '--window-size=1920x1080'
//                     ],
//                     defaultViewport: null,
//                     ignoreHTTPSErrors: true
//                 });
//
//                 const page = await browser.newPage();
//                 logger.info(`Attempt ${attempt + 1} of ${this.maxRetries} for Case: ${caseType}-${caseNumber}-${caseYear}`);
//                 await page.goto(`${this.baseUrl}/case-status-case-no/`, { waitUntil: 'networkidle2' });
//                 // await setTimeout(1000);
//
//
//                 await page.waitForSelector('a.captcha-refresh-btn');
//                 await page.locator('a.captcha-refresh-btn').click();
//                 await setTimeout(1000);
//                 logger.info('clicked captcha refresh');
//
//
//                 // await page.select('#case_type', caseType);
//                 await page.type('input[name="case_no"]', caseNumber);
//                 console.log(caseNumber)
//                 // await page.select('#year', caseYear);
//
//
//                 await selectDropdownViaKeyboard(page, 'case_type', caseType);
//                 console.log(caseType)
//                 await selectDropdownViaKeyboard(page, 'year', caseYear);
//                 console.log(caseYear)
//
//
//
//                 // Capture CAPTCHA
//                 await setTimeout(2500);
//                 // await page.waitForSelector('.siwp_img', { timeout: 5000 });
//                 const captchaElement = await page.$('.siwp_img');
//
//                 const captchaBuffer = await captchaElement.screenshot();
//                 await setTimeout(500);
//                 const captchaBase64 = captchaBuffer.toString('base64');
//
//                 // Solve via Mistral
//                 const mistralResponse = await axios.post(
//                     "https://api.mistral.ai/v1/chat/completions",
//                     {
//                         model: "pixtral-12b-2409",
//                         messages: [
//                             {
//                                 role: "user",
//                                 content: [
//                                     { type: "text", text: "The image is a math captcha. Solve it and respond with only the numeric answer. do not show me steps or anything. just provide me the final numeric answer in response and nothing else" },
//                                     { type: "image_url", image_url: { url: `data:image/png;base64,${captchaBase64}` } }
//                                 ]
//                             }
//                         ]
//                     },
//                     {
//                         headers: {
//                             Authorization: "Bearer jj2eLyfF5JEZjrKzlk3ecj7By5CyY94i",
//                             "Content-Type": "application/json"
//                         }
//                     }
//                 );
//
//                 const captchaValue = mistralResponse.data.choices?.[0]?.message?.content?.trim();
//                 logger.info(`[🤖] Mistral Solved CAPTCHA: ${captchaValue}`);
//
//                 await page.type('input[name="siwp_captcha_value"]', captchaValue);
//                 await page.click('input[name="submit"]');
//                 // logger.info('clicked submit');
//
//
//                 // await page.waitForNavigation({ waitUntil: 'networkidle2' });
//
//
//                 // Open the "View" link in a new page
//                 // if (!caseData.viewUrl) {
//                 //     throw new Error('View link not found.');
//                 // }
//
//                 // const baseUrl = page.url().split('?')[0];
//                 // remove any query string
//                 setTimeout(1000)
//                 await page.waitForSelector('a.viewCnrDetails', { visible: true });
//                 // logger.info('clicked view');
//                 await page.click('a.viewCnrDetails');
//                 // setTimeout(10000);
//                 // await page.waitForSelector('div.distTableContent');
//                 await page.waitForSelector('div.push-right.caseStatus.p');
//
//                 const caseDetails = await this.extractCaseDetails(page);
//                 const earlierCourtDetails = await this.extractEarlierCourtDetails(page);
//                 const taggedMatters = await this.extractTaggedMattersDetails(page);
//                 const notices = await this.extractNoticesDetails(page);
//                 const judgmentOrders = await this.extractJudgementOrdersDetails(page);
//
//
//                 await browser.close();
//                 return {caseDetails,earlierCourtDetails,taggedMatters,notices,judgmentOrders};
//
//             }catch(error){
//                 logger.error('Error processing case:', error);
//                 if (browser) {
//                     try {
//                         await browser.close();
//                     } catch (closeError) {
//                         logger.error('Error closing browser:', closeError);
//                     }
//                 }
//
//                 if (attempt === this.maxRetries - 1) {
//                     throw Error('Failed to fetch case data after max retries');
//                 }
//
//                 attempt++;
//                 await new Promise(resolve => {
//                     setTimeout(2000);
//                     resolve()
//                 });
//             }
//         }
//     }
// }
//
// export default new ScScrapper();
import puppeteer from "puppeteer";
import path from "path";
import logger from "../../../util/logger/logger.js";
import fs from "fs-extra";
import axios from "axios";
import {setTimeout} from "node:timers/promises";
import scrapperResponseMapper from "../mappers/scrapperResponseMapper.js";

class ScScrapper {
    constructor() {
        this.baseUrl = 'https://www.sci.gov.in';
        this.maxRetries = 2;
    }

    async extractCaseDetails(page) {
        try {
            const rawData = await page.evaluate(() => {
                const getTextFromRow = (label) => {
                    const rows = document.querySelectorAll('.caseDetailsTable tbody tr');
                    for (let row of rows) {
                        const th = row.querySelector('td:first-child');
                        const td = row.querySelector('td:last-child');
                        if (th && td && th.textContent.trim().toLowerCase().includes(label.toLowerCase())) {
                            return td.innerText.trim().replace(/\s+/g, ' ');
                        }
                    }
                    return '';
                };

                const getCaseTitle = () => {
                    const h4 = document.querySelector('#cnrResultsDetails h4');
                    return h4 ? h4.textContent.trim() : '';
                };

                return {
                    diaryNumber: getTextFromRow('Diary Number'),
                    caseNumber: getTextFromRow('Case Number'),
                    cnrNumber: getTextFromRow('CNR Number'),
                    statusStage: getTextFromRow('Status/Stage'),
                    lastListedOn: getTextFromRow('Present/Last Listed On'),
                    admittedOn: getTextFromRow('Admitted'),
                    category: getTextFromRow('Category'),
                    petitioner: getTextFromRow('Petitioner(s)'),
                    respondent: getTextFromRow('Respondent(s)'),
                    petitionerAdvocates: getTextFromRow('Petitioner Advocate(s)'),
                    respondentAdvocates: getTextFromRow('Respondent Advocate(s)'),
                    impleaderAdvocates: getTextFromRow('Impleaders Advocate(s)'),
                    caseTitle: getCaseTitle()
                };
            });
            logger.info('extracted case details',rawData);

            // Split helper based on leading numbers (like "1.", "1.1", etc.)
            const splitByNumbering = (text) => {
                return text
                    .split(/(?:\s|^)(\d+(?:\.\d+)?)(?=\s)/) // split on leading numbered entries
                    .map(part => part.trim())
                    .filter(entry => entry && !/^\d/.test(entry)); // remove numbers
            };

            // Split by comma helper
            const splitByComma = (text) => {
                return text
                    .split(',')
                    .map(part => part.trim())
                    .filter(Boolean);
            };

            // Transform into structured list
            return {
                ...rawData,
                category: rawData.category,
                petitioners: splitByNumbering(rawData.petitioner),
                respondents: splitByNumbering(rawData.respondent),
                petitionerAdvocates: splitByComma(rawData.petitionerAdvocates),
                respondentAdvocates: splitByComma(rawData.respondentAdvocates),
                impleaderAdvocates: splitByComma(rawData.impleaderAdvocates)
            };

        } catch (error) {
            console.error('Error extracting structured case details:', error);
            throw new Error('Failed to extract details from the case details table');
        }
    }

    async extractEarlierCourtDetails(page) {
        try {
            const button = await page.$('text=Earlier Court Details');
            await button.evaluate(el => el.scrollIntoView());
            await button.click();

            logger.info('clicked earlier court details');

            // Wait for the first row to appear after data loads
            await page.waitForSelector('td[data-th="S.No."] span.bt-content');

            // Extract the data
            const details = await page.evaluate(() => {
                const rows = document.querySelectorAll('table.bt tbody tr');
                const result = [];

                for (const row of rows) {
                    const getText = (selector) => {
                        const cell = row.querySelector(`td[data-th="${selector}"] span.bt-content`);
                        return cell ? cell.textContent.trim().replace(/\s+/g, ' ') : '';
                    };

                    const entry = {
                        sno: getText("S.No."),
                        court: getText("Court"),
                        agencyState: getText("Agency State"),
                        agencyCode: getText("Agency Code"),
                        caseNo: getText("Case No."),
                        orderDate: getText("Order Date"),
                        cnrOrDesignation: getText("CNR No. / Designation"),
                        crimeNoOrYear: getText("Crime No./ Year"),
                        authorityOrOrderNo: getText("Authority / Organisation / Impugned Order No."),
                        judgmentChallenged: getText("Judgment Challenged"),
                        judgmentType: getText("Judgment Type"),
                        referenceCourt: getText("Reference court / State / District / No."),
                        reliedUponCourt: getText("Relied Upon court / State / District / No."),
                        transferTo: getText("Transfer To State / District / No."),
                        govtNotification: getText("Government Notification State / No. /  Date")
                    };

                    // Only include if "sno" (or any other field) is not empty
                    if (entry.sno.trim() !== '') {
                        result.push(entry);
                    }
                }

                return result;
            });

            return details;
        } catch (err) {
            console.error('Error extracting Earlier Court Details:', err);
            throw new Error('Failed to extract Earlier Court Details');
        }
    }

    async extractTaggedMattersDetails(page) {
        try {
            // Ensure the "Tagged Matters" section is expanded
            const button = await page.$('text=Tagged Matters');
            await button.evaluate(el => el.scrollIntoView());
            await button.click();
            // Wait for the nested case rows to appear
            await page.waitForSelector('td[data-th="Type"]');

            // Evaluate the page to extract structured info
            const details = await page.evaluate(() => {
                const rows = document.querySelectorAll('table.caseDetailsTable.tagged_matters table tbody tr');
                const result = [];

                for (const row of rows) {
                    const getText = (selector) => {
                        const cell = row.querySelector(`td[data-th="${selector}"] span.bt-content`);
                        return cell ? cell.textContent.trim().replace(/\s+/g, ' ') : '';
                    };

                    const entry = {
                        type: getText("Type"),
                        caseNumber: getText("Case Number"),
                        petitionerVsRespondent: getText("Petitioner vs. Respondent"),
                        list: getText("List"),
                        status: getText("Status"),
                        statutoryInfo: getText("Stat. Info."),
                        ia: getText("IA"),
                        entryDate: getText("Entry Date")
                    };

                    if (entry.caseNumber) {
                        result.push(entry);
                    }
                }

                return result;
            });

            return details;
        } catch (err) {
            console.error('Error extracting Tagged Matters details:', err);
            throw new Error('Failed to extract Tagged Matters details');
        }
    }

    async extractJudgementOrdersDetails(page) {
        try {
            // Ensure the "Judgement/Orders" section is expanded
            const button = await page.$('text=Judgement/Orders');
            await button.evaluate(el => el.scrollIntoView());
            await button.click();
            await page.waitForSelector('table.caseDetailsTable.judgement_orders tbody tr td a');

            const orders = await page.evaluate(() => {
                const rows = document.querySelectorAll(
                    'table.caseDetailsTable.judgement_orders tbody tr'
                );
                const result = [];

                for (const row of rows) {
                    const link = row.querySelector('a');
                    // logger.info(link);
                    if (link) {
                        const date = link.textContent.trim();
                        const href = link.href;
                        const matched = link.text.match(/\[(.*?)\]/);
                        // const typeMatch = matched ? matched[1].trim() : "";
                        result.push({
                            date,
                            link: href,
                            // type: typeMatch || 'Unknown'
                        });
                    }
                }

                return result;
            });

            return orders;
        } catch (err) {
            console.error('Error extracting Judgement/Orders details:', err);
            throw new Error('Failed to extract Judgement/Orders details');
        }
    }

    async extractNoticesDetails(page) {
        try {
            // Click the Notices section if it's not already expanded
            const button = await page.$('table.caseDetailsTable.notices > thead button');
            if (button) {
                await button.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
                await button.click();
            } else {
                throw new Error('Button not found!');
            }

            // Wait for nested rows inside the Notices table
            await page.waitForSelector('td[data-th="Name"]');

            const details = await page.evaluate(() => {
                const rows = document.querySelectorAll('table.caseDetailsTable.notices table tbody tr');
                const result = [];

                for (const row of rows) {
                    const getText = (header) => {
                        const cell = row.querySelector(`td[data-th="${header}"] span.bt-content`);
                        return cell ? cell.textContent.trim().replace(/\s+/g, ' ') : '';
                    };

                    const entry = {
                        serialNumber: getText('Serial Number'),
                        processId: getText('Process Id'),
                        noticeType: getText('Notice Type'),
                        name: getText('Name'),
                        stateDistrict: getText('State / District'),
                        station: getText('Station'), // Note: May be blank
                        issueDate: getText('Issue Date'),
                        returnableDate: getText('Returnable Date'),
                        dispatchDate: getText('Dispatch Date') // Also may be blank
                    };

                    if (entry.processId) {
                        result.push(entry);
                    }
                }

                return result;
            });

            return details;
        } catch (err) {
            console.error('Error extracting Notices details:', err);
            throw new Error('Failed to extract Notices details');
        }
    }

    async getCaseData(caseType, caseNumber, caseYear) {
        let browser;
        let attempt = 0;

        async function selectDropdownViaKeyboard(page, formRowClass, optionText) {
            // Locate the container (e.g., form-row.case_type or form-row.case_year)
            const containerHandle = await page.$(`div.form-row.${formRowClass}`);
            if (!containerHandle) throw new Error(`Dropdown with class '${formRowClass}' not found.`);

            // Find and click the select2 dropdown inside it
            const dropdownHandle = await containerHandle.$('.select2-selection__arrow');
            await dropdownHandle.click();

            // Wait for the search input inside the Select2 dropdown to appear
            await page.waitForSelector('input.select2-search__field');

            // Type the desired text
            await page.type('input.select2-search__field', optionText);

            // Wait a bit to allow options to populate
            // await page.waitForTimeout(500); // adjust if needed

            // Press Enter to select the top matching result
            await page.keyboard.press('Enter');
        }

        while (attempt < this.maxRetries) {
            try {
                // Enhanced browser configuration for headless mode
                browser = await puppeteer.launch({
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--disable-gpu',
                        '--window-size=1920,1080',
                        '--disable-features=VizDisplayCompositor',
                        '--disable-extensions',
                        '--disable-plugins',
                        '--disable-images', // This can speed up loading
                        '--disable-javascript-harmony-shipping',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-renderer-backgrounding',
                        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    ],
                    defaultViewport: { width: 1920, height: 1080 },
                    ignoreHTTPSErrors: true,
                    timeout: 60000
                });

                const page = await browser.newPage();

                // Set additional headers to mimic real browser
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
                await page.setExtraHTTPHeaders({
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                });

                // Enable request interception to handle potential blocks
                await page.setRequestInterception(true);
                page.on('request', (req) => {
                    // if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font'){
                    //     req.abort();
                    // } else {
                        req.continue();
                    // }
                });

                logger.info(`Attempt ${attempt + 1} of ${this.maxRetries} for Case: ${caseType}-${caseNumber}-${caseYear}`);

                // Navigate with longer timeout
                await page.goto(`${this.baseUrl}/case-status-case-no/`, {
                    waitUntil: 'domcontentloaded',
                    timeout: 60000
                });

                // Wait longer for page to fully load
                await setTimeout(3000);

                // Try multiple selectors for captcha refresh button
                let captchaRefreshButton;
                const captchaSelectors = [
                    'a.captcha-refresh-btn',
                    '.captcha-refresh-btn',
                    'a[class*="captcha"]',
                    'a[href*="captcha"]',
                    'button.captcha-refresh-btn'
                ];

                for (const selector of captchaSelectors) {
                    try {
                        await page.waitForSelector(selector, { timeout: 5000, visible: true });
                        captchaRefreshButton = await page.$(selector);
                        if (captchaRefreshButton) {
                            logger.info(`Found captcha button with selector: ${selector}`);
                            break;
                        }
                    } catch (err) {
                        logger.info(`Selector ${selector} not found, trying next...`);
                        continue;
                    }
                }

                if (!captchaRefreshButton) {
                    // Try to find any clickable element containing 'captcha' or 'refresh'
                    captchaRefreshButton = await page.evaluateHandle(() => {
                        const elements = Array.from(document.querySelectorAll('a, button'));
                        return elements.find(el =>
                            el.textContent.toLowerCase().includes('refresh') ||
                            el.className.toLowerCase().includes('captcha') ||
                            el.getAttribute('onclick')?.includes('captcha')
                        );
                    });
                }

                if (captchaRefreshButton && captchaRefreshButton.asElement) {
                    await captchaRefreshButton.asElement().scrollIntoView();
                    await captchaRefreshButton.asElement().click();
                    await setTimeout(2000);
                    logger.info('clicked captcha refresh');
                } else {
                    logger.warn('Captcha refresh button not found, continuing without refresh...');
                }

                // Fill form fields
                await page.type('input[name="case_no"]', caseNumber);
                console.log(caseNumber);
                try {
                    await selectDropdownViaKeyboard(page, 'case_type', caseType);
                    console.log(caseType);
                    await selectDropdownViaKeyboard(page, 'year', caseYear);
                    console.log(caseYear);
                }
                catch (error) {
                    logger.error('Error selecting dropdowns:', error);
                    throw new Error('Failed to select dropdowns'+error);
                }

                // Enhanced captcha handling
                await setTimeout(3000);

                // Try multiple selectors for captcha image
                let captchaElement;
                const captchaImageSelectors = ['.siwp_img', 'img[src*="captcha"]', '.captcha-img', '#captcha'];

                for (const selector of captchaImageSelectors) {
                    try {
                        await page.waitForSelector(selector, { timeout: 5000, visible: true });
                        captchaElement = await page.$(selector);
                        if (captchaElement) {
                            logger.info(`Found captcha image with selector: ${selector}`);
                            break;
                        }
                    } catch (err) {
                        continue;
                    }
                }

                if (!captchaElement) {
                    throw new Error('Captcha image not found');
                }

                const captchaBuffer = await captchaElement.screenshot();
                await setTimeout(500);
                const captchaBase64 = captchaBuffer.toString('base64');

                // Solve via Mistral
                const mistralResponse = await axios.post(
                    "https://api.mistral.ai/v1/chat/completions",
                    {
                        model: "pixtral-12b-2409",
                        messages: [
                            {
                                role: "user",
                                content: [
                                    { type: "text", text: "The image is a math captcha. Solve it and respond with only the numeric answer. do not show me steps or anything. just provide me the final numeric answer in response and nothing else" },
                                    { type: "image_url", image_url: { url: `data:image/png;base64,${captchaBase64}` } }
                                ]
                            }
                        ]
                    },
                    {
                        headers: {
                            Authorization: "Bearer jj2eLyfF5JEZjrKzlk3ecj7By5CyY94i",
                            "Content-Type": "application/json"
                        }
                    }
                );

                const captchaValue = mistralResponse.data.choices?.[0]?.message?.content?.trim();
                logger.info(`[🤖] Mistral Solved CAPTCHA: ${captchaValue}`);

                await page.type('input[name="siwp_captcha_value"]', captchaValue);
                await page.click('input[name="submit"]');

                // Wait for results with longer timeout
                await setTimeout(2000);
                await page.waitForSelector('a.viewCnrDetails', { visible: true, timeout: 30000 });
                await page.click('a.viewCnrDetails');

                await page.waitForSelector('div.push-right.caseStatus.p', { timeout: 30000 });

                const caseDetails = await this.extractCaseDetails(page);
                const earlierCourtDetails = await this.extractEarlierCourtDetails(page);
                const taggedMatters = await this.extractTaggedMattersDetails(page);
                const notices = await this.extractNoticesDetails(page);
                const judgmentOrders = await this.extractJudgementOrdersDetails(page);

                await browser.close();
                const data ={caseDetails, earlierCourtDetails, taggedMatters, notices, judgmentOrders};
                return scrapperResponseMapper.mapScResponse(data);

            } catch(error) {
                logger.error('Error processing case:', error);
                if (browser) {
                    try {
                        await browser.close();
                    } catch (closeError) {
                        logger.error('Error closing browser:', closeError);
                    }
                }

                if (attempt === this.maxRetries - 1) {
                    throw new Error('Failed to fetch case data after max retries');
                }

                attempt++;
                await setTimeout(3000); // Increased delay between retries
            }
        }
    }
}

export default new ScScrapper();