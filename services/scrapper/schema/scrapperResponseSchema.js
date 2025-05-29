/**
 * Standard schema for case details response across all court scrapers
 */
export const StandardCaseResponse = {
    // Basic case information
    caseInfo: {
        caseNumber: String,         // Unique case identifier
        caseType: String,          // Type of case
        registrationDate: String,   // When the case was registered
        caseStatus: String,        // Current status of the case
        courtName: String,         // Name of the court
        category: String,          // Case category
        diaryNumber: String        // Diary number if available
    },

    // Party information
    parties: {
        petitioners: [{
            name: String,          // Name of petitioner
            advocate: String       // Advocate representing petitioner
        }],
        respondents: [{
            name: String,          // Name of respondent
            advocate: String       // Advocate representing respondent
        }]
    },

    // Case history/listings
    hearings: [{
        date: String,             // Date of hearing
        bench: String,            // Bench details
        purpose: String,          // Purpose of hearing
        type: String,             // Type of listing
        status: String            // Outcome/status of hearing
    }],

    // Orders and judgments
    orders: [{
        orderDate: String,        // Date of order
        orderNumber: String,      // Order reference number
        orderType: String,        // Type of order
        orderDetails: String,     // Details of the order
        judgmentLink: String      // Link to judgment if available
    }],

    // Related cases
    relatedCases: [{
        caseNumber: String,       // Related case number
        description: String,      // Description of relationship
        link: String             // Link to related case
    }],

    // Acts and sections
    acts: [{
        act: String,             // Name of act
        section: String          // Section number
    }],

    // Additional details
    additionalDetails: {
        district: String,         // District information
        filingDate: String,      // Date of filing
        filingNumber: String,    // Filing number
        mainCaseDetails: String  // Any other case specific details
    },

    // Metadata
    metadata: {
        scrapedFrom: String,     // Source court (DLHC/PHHC/eServices)
        scrapedAt: String,       // Timestamp of scraping
        success: Boolean,        // Whether scraping was successful
        error: String           // Error message if any
    }
};

export default StandardCaseResponse; 