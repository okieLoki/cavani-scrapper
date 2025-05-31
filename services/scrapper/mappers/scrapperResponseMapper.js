class ScrapperResponseMapper {

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
                    diaryNumber: dlhcResponse.caseDetails?.diaryNumber || '',
                    cnrNumber: '',
                    lastListedOn: '',
                    nextListedOn: '',
                    courtNumber: '',
                    coramBench: ''
                },
                parties: {
                    petitioners: [{
                        name: dlhcResponse.caseDetails?.partyDetail || '',
                        advocate: dlhcResponse.caseDetails?.advocateName || ''
                    }],
                    respondents: [],
                    impleaders: []
                },
                hearings: dlhcResponse.caseListing?.map(listing => ({
                    date: listing.causeListDate || '',
                    bench: listing.bench || '',
                    purpose: '',
                    type: listing.listTypeSrNo || '',
                    status: '',
                    nextDate: '',
                    remarks: ''
                })) || [],
                orders: dlhcResponse.orders?.map(order => ({
                    orderDate: order.orderDate || '',
                    orderNumber: order.serialNo || '',
                    orderType: 'Order',
                    orderDetails: '',
                    judgmentLink: order.orderLink || '',
                    corrigendumLink: order.corrigendumLink || '',
                    hindiOrderLink: order.hindiOrder || ''
                })) || [],
                relatedCases: dlhcResponse.relatedCases?.map(related => ({
                    caseNumber: related.caseNo || '',
                    description: related.description || '',
                    link: related.link || '',
                    type: '',
                    status: ''
                })) || [],
                acts: [],
                copyApplications: [],
                notices: [],
                earlierCourt: [],
                taggedMatters: [],
                additionalDetails: {
                    district: dlhcResponse.caseDetails?.district || '',
                    filingDate: '',
                    filingNumber: '',
                    mainCaseDetails: dlhcResponse.caseDetails?.mainCaseDetail || '',
                    admittedDate: '',
                    stateDistrict: '',
                    filingCourtName: ''
                },
                metadata: {
                    scrapedFrom: 'DLHC',
                    scrapedAt: new Date().toISOString(),
                    success: true,
                    error: '',
                    totalOrders: dlhcResponse.totalOrders || 0
                }
            };
        } catch (error) {
            return this.getErrorResponse('DLHC', error.message);
        }
    }


    // mapScResponse(scResponse) {
    //     try {
    //         const { caseDetails, earlierCourtDetails, taggedMatters, notices, judgmentOrders } = scResponse;
    //
    //         return {
    //             caseInfo: {
    //                 caseNumber: caseDetails.caseNumber || '',
    //                 caseType: '',
    //                 registrationDate: '',
    //                 caseStatus: caseDetails.statusStage || '',
    //                 courtName: 'Supreme Court of India',
    //                 category: caseDetails.category || '',
    //                 diaryNumber: caseDetails.diaryNumber || '',
    //                 cnrNumber: caseDetails.cnrNumber || '',
    //                 lastListedOn: caseDetails.lastListedOn || '',
    //                 nextListedOn: '',
    //                 courtNumber: '',
    //                 coramBench: ''
    //             },
    //             parties: {
    //                 petitioners: caseDetails.petitioners?.map(p => ({
    //                     name: p || '',
    //                     advocate: ''
    //                 })) || [],
    //                 respondents: caseDetails.respondents?.map(r => ({
    //                     name: r || '',
    //                     advocate: ''
    //                 })) || [],
    //                 impleaders: caseDetails.impleaderAdvocates?.map(i => ({
    //                     name: '',
    //                     advocate: i
    //                 })) || []
    //             },
    //             hearings: [],
    //             orders: judgmentOrders?.map(order => ({
    //                 orderDate: order.date || '',
    //                 orderNumber: '',
    //                 orderType: 'Order',
    //                 orderDetails: '',
    //                 judgmentLink: order.link || '',
    //                 corrigendumLink: '',
    //                 hindiOrderLink: ''
    //             })) || [],
    //             relatedCases: [],
    //             acts: [],
    //             copyApplications: [],
    //             notices: notices?.map(notice => ({
    //                 serialNumber: notice.serialNumber || '',
    //                 processId: notice.processId || '',
    //                 noticeType: notice.noticeType || '',
    //                 name: notice.name || '',
    //                 stateDistrict: notice.stateDistrict || '',
    //                 station: notice.station || '',
    //                 issueDate: notice.issueDate || '',
    //                 returnableDate: notice.returnableDate || '',
    //                 dispatchDate: notice.dispatchDate || ''
    //             })) || [],
    //             earlierCourt: earlierCourtDetails?.map(court => ({
    //                 sno: court.sno || '',
    //                 court: court.court || '',
    //                 agencyState: court.agencyState || '',
    //                 agencyCode: court.agencyCode || '',
    //                 caseNo: court.caseNo || '',
    //                 orderDate: court.orderDate || '',
    //                 cnrOrDesignation: court.cnrOrDesignation || '',
    //                 crimeNoOrYear: court.crimeNoOrYear || '',
    //                 authorityOrOrderNo: court.authorityOrOrderNo || '',
    //                 judgmentChallenged: court.judgmentChallenged || '',
    //                 judgmentType: court.judgmentType || '',
    //                 referenceCourt: court.referenceCourt || '',
    //                 reliedUponCourt: court.reliedUponCourt || '',
    //                 transferTo: court.transferTo || '',
    //                 govtNotification: court.govtNotification || ''
    //             })) || [],
    //             taggedMatters: taggedMatters?.map(matter => ({
    //                 type: matter.type || '',
    //                 caseNumber: matter.caseNumber || '',
    //                 petitionerVsRespondent: matter.petitionerVsRespondent || '',
    //                 list: matter.list || '',
    //                 status: matter.status || '',
    //                 statutoryInfo: matter.statutoryInfo || '',
    //                 ia: matter.ia || '',
    //                 entryDate: matter.entryDate || ''
    //             })) || [],
    //             additionalDetails: {
    //                 district: '',
    //                 filingDate: '',
    //                 filingNumber: '',
    //                 mainCaseDetails: caseDetails.caseTitle || '',
    //                 admittedDate: caseDetails.admittedOn || '',
    //                 stateDistrict: '',
    //                 filingCourtName: ''
    //             },
    //             metadata: {
    //                 scrapedFrom: 'SC',
    //                 scrapedAt: new Date().toISOString(),
    //                 success: true,
    //                 error: ''
    //             }
    //         };
    //     } catch (error) {
    //         return this.getErrorResponse('SC', error.message);
    //     }
    // }
    mapScResponse(scResponse) {
        try {
            const { caseDetails, earlierCourtDetails, taggedMatters, notices, judgmentOrders } = scResponse;

            // Helper to safely parse date from text like "Filed on 29-03-2010 12:00 AM"
            const extractDateFromText = (text, prefix) => {
                const match = text?.match(new RegExp(`${prefix}\\s*on\\s*([\\d-]+)`, 'i'));
                return match?.[1] || '';
            };

            return {
                caseInfo: {
                    caseNumber: caseDetails.caseNumber || '',
                    caseType: '', // Not explicitly available
                    registrationDate: extractDateFromText(caseDetails.caseNumber, 'Registered') || '',
                    caseStatus: caseDetails.statusStage || '',
                    courtName: 'Supreme Court of India',
                    category: caseDetails.category || '',
                    diaryNumber: caseDetails.diaryNumber || '',
                    cnrNumber: caseDetails.cnrNumber || '',
                    lastListedOn: (caseDetails.lastListedOn || '').split('[')[0].trim(),
                    nextListedOn: '', // Not available
                    courtNumber: '',
                    coramBench: (caseDetails.lastListedOn?.match(/\[(.*?)\]/)?.[1] || '').trim()
                },
                parties: {
                    petitioners: caseDetails.petitioners?.map((name, index) => ({
                        name,
                        advocate: caseDetails.petitionerAdvocates?.[index] || ''
                    })) || [],
                    respondents: caseDetails.respondents?.map((name, index) => ({
                        name,
                        advocate: caseDetails.respondentAdvocates?.[index] || ''
                    })) || [],
                    impleaders: caseDetails.impleaderAdvocates?.map(adv => ({
                        name: '',
                        advocate: adv
                    })) || []
                },
                hearings: [], // Not available
                orders: judgmentOrders?.map(order => ({
                    orderDate: order.date || '',
                    orderNumber: '',
                    orderType: 'Order',
                    orderDetails: '',
                    judgmentLink: order.link || '',
                    corrigendumLink: '',
                    hindiOrderLink: ''
                })) || [],
                relatedCases: [],
                acts: [],
                copyApplications: [],
                notices: notices?.map(notice => ({
                    serialNumber: notice.serialNumber || '',
                    processId: notice.processId || '',
                    noticeType: notice.noticeType || '',
                    name: notice.name || '',
                    stateDistrict: notice.stateDistrict || '',
                    station: notice.station || '',
                    issueDate: notice.issueDate || '',
                    returnableDate: notice.returnableDate || '',
                    dispatchDate: notice.dispatchDate || ''
                })) || [],
                earlierCourt: earlierCourtDetails?.map(court => ({
                    sno: court.sno || '',
                    court: court.court || '',
                    agencyState: court.agencyState || '',
                    agencyCode: court.agencyCode || '',
                    caseNo: court.caseNo || '',
                    orderDate: court.orderDate || '',
                    cnrOrDesignation: court.cnrOrDesignation || '',
                    crimeNoOrYear: court.crimeNoOrYear || '',
                    authorityOrOrderNo: court.authorityOrOrderNo || '',
                    judgmentChallenged: court.judgmentChallenged || '',
                    judgmentType: court.judgmentType || '',
                    referenceCourt: court.referenceCourt || '',
                    reliedUponCourt: court.reliedUponCourt || '',
                    transferTo: court.transferTo || '',
                    govtNotification: court.govtNotification || ''
                })) || [],
                taggedMatters: taggedMatters?.map(matter => ({
                    type: matter.type || '',
                    caseNumber: matter.caseNumber || '',
                    petitionerVsRespondent: matter.petitionerVsRespondent || '',
                    list: matter.list || '',
                    status: matter.status || '',
                    statutoryInfo: matter.statutoryInfo || '',
                    ia: matter.ia || '',
                    entryDate: matter.entryDate || ''
                })) || [],
                additionalDetails: {
                    district: '',
                    filingDate: extractDateFromText(caseDetails.diaryNumber, 'Filed') || '',
                    filingNumber: '',
                    mainCaseDetails: caseDetails.caseTitle || '',
                    admittedDate: (caseDetails.admittedOn?.match(/ADMITTED ON\s*:\s*([\d-]+)/i)?.[1]) || '',
                    stateDistrict: '',
                    filingCourtName: ''
                },
                metadata: {
                    scrapedFrom: 'SC',
                    scrapedAt: new Date().toISOString(),
                    success: true,
                    error: ''
                }
            };
        } catch (error) {
            return this.getErrorResponse('SC', error.message);
        }
    }


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
                    diaryNumber: phhcResponse.caseDetails?.diaryNumber || '',
                    cnrNumber: '',
                    lastListedOn: '',
                    nextListedOn: '',
                    courtNumber: '',
                    coramBench: ''
                },
                parties: {
                    petitioners: [{
                        name: phhcResponse.caseDetails?.partyDetail || '',
                        advocate: phhcResponse.caseDetails?.advocateName || ''
                    }],
                    respondents: [],
                    impleaders: []
                },
                hearings: phhcResponse.caseListing?.map(listing => ({
                    date: listing.causeListDate || '',
                    bench: listing.bench || '',
                    purpose: '',
                    type: listing.listTypeSrNo || '',
                    status: '',
                    nextDate: '',
                    remarks: ''
                })) || [],
                orders: phhcResponse.judgments?.map(judgment => ({
                    orderDate: judgment.orderDate || '',
                    orderNumber: judgment.orderCaseId || '',
                    orderType: 'Judgment',
                    orderDetails: '',
                    judgmentLink: judgment.judgmentLink || '',
                    corrigendumLink: '',
                    hindiOrderLink: ''
                })) || [],
                relatedCases: phhcResponse.relatedCases?.map(related => ({
                    caseNumber: related.caseNo || '',
                    description: related.description || '',
                    link: related.link || '',
                    type: '',
                    status: ''
                })) || [],
                acts: [],
                copyApplications: phhcResponse.copyPetitions?.map(petition => ({
                    petitionTypeNo: petition.petitionTypeNo || '',
                    petitionDate: petition.petitionDate || '',
                    appliedBy: petition.appliedBy || '',
                    petitionStatus: petition.petitionStatus || ''
                })) || [],
                notices: [],
                earlierCourt: [],
                taggedMatters: [],
                additionalDetails: {
                    district: phhcResponse.caseDetails?.district || '',
                    filingDate: '',
                    filingNumber: '',
                    mainCaseDetails: phhcResponse.caseDetails?.mainCaseDetail || '',
                    admittedDate: '',
                    stateDistrict: '',
                    filingCourtName: ''
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
                    diaryNumber: caseDetails['Filing Number'] || '',
                    cnrNumber: '',
                    lastListedOn: '',
                    nextListedOn: '',
                    courtNumber: '',
                    coramBench: ''
                },
                parties: {
                    petitioners: eservicesResponse.petitioner?.map(p => ({
                        name: p,
                        advocate: ''
                    })) || [],
                    respondents: eservicesResponse.respondent?.map(r => ({
                        name: r,
                        advocate: ''
                    })) || [],
                    impleaders: []
                },
                hearings: eservicesResponse.caseHistory?.map(history => ({
                    date: history.businessDate || '',
                    bench: history.judge || '',
                    purpose: history.purpose || '',
                    type: '',
                    status: '',
                    nextDate: history.hearingDate || '',
                    remarks: ''
                })) || [],
                orders: eservicesResponse.orders?.map(order => ({
                    orderDate: order.orderDate || '',
                    orderNumber: order.orderNumber || '',
                    orderType: 'Order',
                    orderDetails: order.orderDetails || '',
                    judgmentLink: '',
                    corrigendumLink: '',
                    hindiOrderLink: ''
                })) || [],
                relatedCases: [],
                acts: eservicesResponse.acts?.map(act => ({
                    act: act.act || '',
                    section: act.section || ''
                })) || [],
                copyApplications: [],
                notices: [],
                earlierCourt: [],
                taggedMatters: [],
                additionalDetails: {
                    district: caseDetails['District'] || '',
                    filingDate: caseDetails['Filing Date'] || '',
                    filingNumber: caseDetails['Filing Number'] || '',
                    mainCaseDetails: '',
                    admittedDate: '',
                    stateDistrict: '',
                    filingCourtName: caseDetails['Court Name'] || ''
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


    getErrorResponse(source, errorMessage) {
        return {
            caseInfo: {
                caseNumber: '',
                caseType: '',
                registrationDate: '',
                caseStatus: '',
                courtName: '',
                category: '',
                diaryNumber: '',
                cnrNumber: '',
                lastListedOn: '',
                nextListedOn: '',
                courtNumber: '',
                coramBench: ''
            },
            parties: {
                petitioners: [],
                respondents: [],
                impleaders: []
            },
            hearings: [],
            orders: [],
            relatedCases: [],
            acts: [],
            copyApplications: [],
            notices: [],
            earlierCourt: [],
            taggedMatters: [],
            additionalDetails: {
                district: '',
                filingDate: '',
                filingNumber: '',
                mainCaseDetails: '',
                admittedDate: '',
                stateDistrict: '',
                filingCourtName: ''
            },
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