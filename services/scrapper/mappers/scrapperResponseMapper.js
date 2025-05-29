import { StandardCaseResponse } from '../schema/scrapperResponseSchema.js';

class ScrapperResponseMapper {
    /**
     * Maps Delhi High Court scraper response to standard format
     */
    mapDlhcResponse(dlhcResponse) {
        try {
            return {
                caseInfo: {
                    caseNumber: dlhcResponse.caseDetails?.mainCaseDetail || '',
                    caseType: dlhcResponse.caseDetails?.category || '',
                    registrationDate: dlhcResponse.caseDetails?.registrationDate || '',
                    caseStatus: dlhcResponse.caseDetails?.status || '',
                    courtName: 'Delhi High Court',
                    category: dlhcResponse.caseDetails?.category || '',
                    diaryNumber: dlhcResponse.caseDetails?.diaryNumber || ''
                },
                parties: {
                    petitioners: [{
                        name: dlhcResponse.caseDetails?.partyDetail || '',
                        advocate: dlhcResponse.caseDetails?.advocateName || ''
                    }],
                    respondents: [] // DLHC doesn't provide separate respondent details
                },
                hearings: dlhcResponse.caseListing?.map(listing => ({
                    date: listing.causeListDate || '',
                    bench: listing.bench || '',
                    purpose: '',
                    type: listing.listTypeSrNo || '',
                    status: ''
                })) || [],
                orders: dlhcResponse.judgments?.map(judgment => ({
                    orderDate: judgment.orderDate || '',
                    orderNumber: judgment.orderCaseId || '',
                    orderType: 'Judgment',
                    orderDetails: '',
                    judgmentLink: judgment.judgmentLink || ''
                })) || [],
                relatedCases: dlhcResponse.relatedCases?.map(related => ({
                    caseNumber: related.caseNo || '',
                    description: related.description || '',
                    link: related.link || ''
                })) || [],
                acts: [],
                additionalDetails: {
                    district: dlhcResponse.caseDetails?.district || '',
                    filingDate: '',
                    filingNumber: '',
                    mainCaseDetails: dlhcResponse.caseDetails?.mainCaseDetail || ''
                },
                metadata: {
                    scrapedFrom: 'DLHC',
                    scrapedAt: new Date().toISOString(),
                    success: true,
                    error: ''
                }
            };
        } catch (error) {
            return this.getErrorResponse('DLHC', error.message);
        }
    }

    /**
     * Maps Punjab & Haryana High Court scraper response to standard format
     */
    mapPhhcResponse(phhcResponse) {
        try {
            return {
                caseInfo: {
                    caseNumber: phhcResponse.caseDetails?.mainCaseDetail || '',
                    caseType: phhcResponse.caseDetails?.category || '',
                    registrationDate: phhcResponse.caseDetails?.registrationDate || '',
                    caseStatus: phhcResponse.caseDetails?.status || '',
                    courtName: 'Punjab & Haryana High Court',
                    category: phhcResponse.caseDetails?.category || '',
                    diaryNumber: phhcResponse.caseDetails?.diaryNumber || ''
                },
                parties: {
                    petitioners: [{
                        name: phhcResponse.caseDetails?.partyDetail || '',
                        advocate: phhcResponse.caseDetails?.advocateName || ''
                    }],
                    respondents: [] // PHHC doesn't provide separate respondent details
                },
                hearings: phhcResponse.caseListing?.map(listing => ({
                    date: listing.causeListDate || '',
                    bench: listing.bench || '',
                    purpose: '',
                    type: listing.listTypeSrNo || '',
                    status: ''
                })) || [],
                orders: phhcResponse.judgments?.map(judgment => ({
                    orderDate: judgment.orderDate || '',
                    orderNumber: judgment.orderCaseId || '',
                    orderType: 'Judgment',
                    orderDetails: '',
                    judgmentLink: judgment.judgmentLink || ''
                })) || [],
                relatedCases: phhcResponse.relatedCases?.map(related => ({
                    caseNumber: related.caseNo || '',
                    description: related.description || '',
                    link: related.link || ''
                })) || [],
                acts: [],
                additionalDetails: {
                    district: phhcResponse.caseDetails?.district || '',
                    filingDate: '',
                    filingNumber: '',
                    mainCaseDetails: phhcResponse.caseDetails?.mainCaseDetail || ''
                },
                metadata: {
                    scrapedFrom: 'PHHC',
                    scrapedAt: new Date().toISOString(),
                    success: true,
                    error: ''
                }
            };
        } catch (error) {
            return this.getErrorResponse('PHHC', error.message);
        }
    }

    /**
     * Maps eServices scraper response to standard format
     */
    mapEservicesResponse(eservicesResponse) {
        try {
            const caseDetails = eservicesResponse.caseDetails || {};
            const caseStatus = eservicesResponse.caseStatus || {};
            
            return {
                caseInfo: {
                    caseNumber: caseDetails['Case Number'] || '',
                    caseType: caseDetails['Case Type'] || '',
                    registrationDate: caseDetails['Registration Date'] || '',
                    caseStatus: caseStatus['Case Status'] || '',
                    courtName: eservicesResponse.courtName || '',
                    category: caseDetails['Case Category'] || '',
                    diaryNumber: caseDetails['Filing Number'] || ''
                },
                parties: {
                    petitioners: eservicesResponse.petitioner?.map(p => ({
                        name: p,
                        advocate: ''
                    })) || [],
                    respondents: eservicesResponse.respondent?.map(r => ({
                        name: r,
                        advocate: ''
                    })) || []
                },
                hearings: eservicesResponse.caseHistory?.map(history => ({
                    date: history.businessDate || '',
                    bench: history.judge || '',
                    purpose: history.purpose || '',
                    type: '',
                    status: ''
                })) || [],
                orders: eservicesResponse.orders?.map(order => ({
                    orderDate: order.orderDate || '',
                    orderNumber: order.orderNumber || '',
                    orderType: 'Order',
                    orderDetails: order.orderDetails || '',
                    judgmentLink: ''
                })) || [],
                relatedCases: [],
                acts: eservicesResponse.acts?.map(act => ({
                    act: act.act || '',
                    section: act.section || ''
                })) || [],
                additionalDetails: {
                    district: caseDetails['District'] || '',
                    filingDate: caseDetails['Filing Date'] || '',
                    filingNumber: caseDetails['Filing Number'] || '',
                    mainCaseDetails: ''
                },
                metadata: {
                    scrapedFrom: 'eServices',
                    scrapedAt: new Date().toISOString(),
                    success: true,
                    error: ''
                }
            };
        } catch (error) {
            return this.getErrorResponse('eServices', error.message);
        }
    }

    /**
     * Returns a standardized error response
     */
    getErrorResponse(source, errorMessage) {
        return {
            caseInfo: {},
            parties: { petitioners: [], respondents: [] },
            hearings: [],
            orders: [],
            relatedCases: [],
            acts: [],
            additionalDetails: {},
            metadata: {
                scrapedFrom: source,
                scrapedAt: new Date().toISOString(),
                success: false,
                error: errorMessage
            }
        };
    }
}

export default new ScrapperResponseMapper(); 