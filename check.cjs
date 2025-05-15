const puppeteer = require('puppeteer');

async function searchCase(caseType, caseNumber, caseYear) {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920x1080'
        ],
        defaultViewport: null,
        ignoreHTTPSErrors: true
    }); // set to true to hide browser
    // const browser = await puppeteer.launch({
    //     headless: false,
    //     executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' // macOS example
    // });

    const page = await browser.newPage();
    await page.goto('https://phhc.gov.in/home.php?search_param=case', {
        waitUntil: 'domcontentloaded',
    });

    // Wait for the form elements to load
    await page.waitForSelector('#t_case_type');
    await page.waitForSelector('#t_case_no');
    await page.waitForSelector('#t_case_year');

    // Fill the form
    await page.select('#t_case_type', caseType); // e.g., 'CWP'
    await page.type('#t_case_no', caseNumber);   // e.g., '12345'
    await page.select('#t_case_year', caseYear); // e.g., '2021'

    // Click the "Search Case" button
    await page.click('input[name="submit"]');

    // Wait for navigation or result page load
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Optional: Take a screenshot or extract data
    await page.screenshot({ path: 'case_result.png' });


    // Close the browser
    await browser.close();
}

// Example usage
searchCase('CWP', '12206', '2005');
