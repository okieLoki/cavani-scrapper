// class ScrapperResponseMapper {
//     mapDlhcResponse(d) {
//       try {
//         return {
//           caseInfo: {
//             caseNumber: d.caseDetails?.mainCaseDetail || '',
//             caseType: d.caseDetails?.category || '',
//             registrationDate: d.caseDetails?.registrationDate || '',
//             caseStatus: d.caseDetails?.status || '',
//             courtName: 'Delhi High Court',
//             category: d.caseDetails?.category || '',
//             diaryNumber: d.caseDetails?.diaryNumber || '',
//             cnrNumber: '',
//             lastListedOn: '',
//             nextListedOn: d.listingInfo?.nextDate || '',
//             courtNumber: d.listingInfo?.courtNumber || '',
//             coramBench: ''
//           },
//           parties: {
//             petitioners: [{ name: d.parties?.petitioner || '', advocate: '' }],
//             respondents: [{ name: d.parties?.respondent || '', advocate: '' }],
//             impleaders: []
//           },
//           hearings: (d.caseListing || []).map(l => ({
//             date: l.causeListDate,
//             bench: l.bench,
//             type: l.listTypeSrNo
//           })),
//           orders: (d.orders || []).map(o => ({
//             orderDate: o.orderDate,
//             orderNumber: o.serialNo,
//             orderType: 'Order',
//             judgmentLink: o.orderLink,
//             corrigendumLink: o.corrigendumLink,
//             hindiOrderLink: o.hindiOrder
//           })),
//           relatedCases: (d.relatedCases || []).map(r => ({
//             caseNumber: r.caseNo,
//             description: r.description,
//             link: r.link
//           })),
//           acts: [],
//           copyApplications: [],
//           notices: [],
//           earlierCourt: [],
//           taggedMatters: [],
//           additionalDetails: {
//             district: d.caseDetails?.district || '',
//             filingDate: '',
//             filingNumber: '',
//             mainCaseDetails: d.caseDetails?.mainCaseDetail || '',
//             admittedDate: '',
//             stateDistrict: '',
//             filingCourtName: ''
//           },
//           metadata: {
//             scrapedFrom: 'DLHC',
//             scrapedAt: new Date().toISOString(),
//             success: true,
//             error: ''
//           }
//         };
//       } catch (e) {
//         return this.errorResponse('DLHC', e);
//       }
//     }
//
//     mapScResponse(d) {
//       try {
//         const extractDate = (text, prefix) =>
//           text?.match(new RegExp(`${prefix}\\s*on\\s*([\\d-]+)`, 'i'))?.[1] || '';
//
//         return {
//           caseInfo: {
//             caseNumber: d.caseDetails?.caseNumber || '',
//             caseType: '',
//             registrationDate: extractDate(d.caseDetails?.caseNumber, 'Registered'),
//             caseStatus: d.caseDetails?.statusStage || '',
//             courtName: 'Supreme Court of India',
//             category: d.caseDetails?.category || '',
//             diaryNumber: d.caseDetails?.diaryNumber || '',
//             cnrNumber: d.caseDetails?.cnrNumber || '',
//             lastListedOn: d.caseDetails?.lastListedOn?.split('[')[0]?.trim() || '',
//             nextListedOn: '',
//             courtNumber: '',
//             coramBench: d.caseDetails?.lastListedOn?.match(/\[(.*?)\]/)?.[1]?.trim() || ''
//           },
//           parties: {
//             petitioners: (d.caseDetails?.petitioners || []).map((p, i) => ({
//               name: p,
//               advocate: d.caseDetails?.petitionerAdvocates?.[i] || ''
//             })),
//             respondents: (d.caseDetails?.respondents || []).map((r, i) => ({
//               name: r,
//               advocate: d.caseDetails?.respondentAdvocates?.[i] || ''
//             })),
//             impleaders: (d.caseDetails?.impleaderAdvocates || []).map(a => ({ name: '', advocate: a }))
//           },
//           hearings: [],
//           orders: (d.judgmentOrders || []).map(o => ({
//             orderDate: o.date,
//             orderNumber: '',
//             orderType: 'Order',
//             judgmentLink: o.link
//           })),
//           relatedCases: [],
//           acts: [],
//           copyApplications: [],
//           notices: (d.notices || []).map(n => ({
//             serialNumber: n.serialNumber,
//             processId: n.processId,
//             noticeType: n.noticeType,
//             name: n.name,
//             stateDistrict: n.stateDistrict,
//             station: n.station,
//             issueDate: n.issueDate,
//             returnableDate: n.returnableDate,
//             dispatchDate: n.dispatchDate
//           })),
//           earlierCourt: (d.earlierCourtDetails || []).map(c => ({ ...c })),
//           taggedMatters: (d.taggedMatters || []).map(t => ({ ...t })),
//           additionalDetails: {
//             district: '',
//             filingDate: extractDate(d.caseDetails?.diaryNumber, 'Filed'),
//             filingNumber: d.caseDetails?.diaryNumber || '',
//             mainCaseDetails: d.caseDetails?.caseTitle || '',
//             admittedDate: d.caseDetails?.admittedOn?.match(/ADMITTED ON\s*:\s*([\d-]+)/i)?.[1] || '',
//             stateDistrict: '',
//             filingCourtName: ''
//           },
//           metadata: {
//             scrapedFrom: 'SC',
//             scrapedAt: new Date().toISOString(),
//             success: true,
//             error: ''
//           }
//         };
//       } catch (e) {
//         return this.errorResponse('SC', e);
//       }
//     }
//
//     mapPhhcResponse(d) {
//       try {
//         return {
//           caseInfo: {
//             caseNumber: d.caseDetails?.mainCaseDetail || '',
//             caseType: d.caseDetails?.category || '',
//             registrationDate: d.caseDetails?.registrationDate || '',
//             caseStatus: d.caseDetails?.status || '',
//             courtName: 'Punjab & Haryana High Court',
//             category: d.caseDetails?.category || '',
//             diaryNumber: d.caseDetails?.diaryNumber || '',
//             cnrNumber: '',
//             lastListedOn: '',
//             nextListedOn: '',
//             courtNumber: '',
//             coramBench: ''
//           },
//           parties: {
//             petitioners: [{
//               name: d.caseDetails?.partyDetail || '',
//               advocate: d.caseDetails?.advocateName || ''
//             }],
//             respondents: [],
//             impleaders: []
//           },
//           hearings: (d.caseListing || []).map(l => ({
//             date: l.causeListDate,
//             bench: l.bench,
//             type: l.listTypeSrNo
//           })),
//           orders: (d.judgments || []).map(j => ({
//             orderDate: j.orderDate,
//             orderNumber: j.orderCaseId,
//             orderType: 'Judgment',
//             judgmentLink: j.judgmentLink
//           })),
//           relatedCases: (d.relatedCases || []).map(r => ({
//             caseNumber: r.caseNo,
//             description: r.description,
//             link: r.link
//           })),
//           acts: [],
//           copyApplications: (d.copyPetitions || []).map(c => ({ ...c })),
//           notices: [],
//           earlierCourt: [],
//           taggedMatters: [],
//           additionalDetails: {
//             district: d.caseDetails?.district || '',
//             filingDate: '',
//             filingNumber: '',
//             mainCaseDetails: d.caseDetails?.mainCaseDetail || '',
//             admittedDate: '',
//             stateDistrict: '',
//             filingCourtName: ''
//           },
//           metadata: {
//             scrapedFrom: 'PHHC',
//             scrapedAt: new Date().toISOString(),
//             success: true,
//             error: ''
//           }
//         };
//       } catch (e) {
//         return this.errorResponse('PHHC', e);
//       }
//     }
//
//     mapEservicesResponse(d) {
//       try {
//         const c = d.caseDetails || {};
//         return {
//           caseInfo: {
//             caseNumber: c['Case Number'] || '',
//             caseType: c['Case Type'] || '',
//             registrationDate: c['Registration Date'] || '',
//             caseStatus: d.caseStatus?.['Case Status'] || '',
//             courtName: d.courtName || '',
//             category: c['Case Category'] || '',
//             diaryNumber: c['Filing Number'] || '',
//             cnrNumber: '',
//             lastListedOn: '',
//             nextListedOn: '',
//             courtNumber: '',
//             coramBench: ''
//           },
//           parties: {
//             petitioners: (d.petitioner || []).map(p => ({ name: p, advocate: '' })),
//             respondents: (d.respondent || []).map(r => ({ name: r, advocate: '' })),
//             impleaders: []
//           },
//           hearings: (d.caseHistory || []).map(h => ({
//             date: h.businessDate,
//             bench: h.judge,
//             purpose: h.purpose,
//             nextDate: h.hearingDate
//           })),
//           orders: (d.orders || []).map(o => ({
//             orderDate: o.orderDate,
//             orderNumber: o.orderNumber,
//             orderType: 'Order',
//             orderDetails: o.orderDetails
//           })),
//           relatedCases: [],
//           acts: (d.acts || []).map(a => ({ act: a.act, section: a.section })),
//           copyApplications: [],
//           notices: [],
//           earlierCourt: [],
//           taggedMatters: [],
//           additionalDetails: {
//             district: c['District'] || '',
//             filingDate: c['Filing Date'] || '',
//             filingNumber: c['Filing Number'] || '',
//             mainCaseDetails: '',
//             admittedDate: '',
//             stateDistrict: '',
//             filingCourtName: c['Court Name'] || ''
//           },
//           metadata: {
//             scrapedFrom: 'eServices',
//             scrapedAt: new Date().toISOString(),
//             success: true,
//             error: ''
//           }
//         };
//       } catch (e) {
//         return this.errorResponse('eServices', e);
//       }
//     }
//
//     errorResponse(source, error) {
//       return {
//         caseInfo: {},
//         parties: { petitioners: [], respondents: [], impleaders: [] },
//         hearings: [],
//         orders: [],
//         relatedCases: [],
//         acts: [],
//         copyApplications: [],
//         notices: [],
//         earlierCourt: [],
//         taggedMatters: [],
//         additionalDetails: {},
//         metadata: {
//           scrapedFrom: source,
//           scrapedAt: new Date().toISOString(),
//           success: false,
//           error: error.message || error.toString()
//         }
//       };
//     }
//   }
//
//   export default new ScrapperResponseMapper();
//
// // class ScrapperResponseMapper {
// //   mapDlhcResponse(d) {
// //     try {
// //       const extractDate = (text, prefix) =>
// //           text?.match(new RegExp(`${prefix}\\s*on\\s*([\\d-]+)`, 'i'))?.[1] || '';
// //
// //       return {
// //         caseInfo: {
// //           caseNumber: d.caseDetails?.mainCaseDetail || '',
// //           caseType: d.caseDetails?.category || '',
// //           registrationDate: extractDate(d.caseDetails?.mainCaseDetail, 'Registered') || d.caseDetails?.registrationDate || '',
// //           caseStatus: d.caseDetails?.status || '',
// //           courtName: 'Delhi High Court',
// //           category: d.caseDetails?.category || '',
// //           diaryNumber: d.caseDetails?.diaryNumber || '',
// //           cnrNumber: d.caseDetails?.cnrNumber || '',
// //           lastListedOn: d.caseDetails?.lastListedOn?.split('[')[0]?.trim() || '',
// //           nextListedOn: d.listingInfo?.nextDate || '',
// //           courtNumber: d.listingInfo?.courtNumber || '',
// //           coramBench: d.caseDetails?.lastListedOn?.match(/\[(.*?)\]/)?.[1]?.trim() || ''
// //         },
// //         parties: {
// //           petitioners: (d.parties?.petitioners || [d.parties?.petitioner].filter(Boolean)).map((p, i) => ({
// //             name: p,
// //             advocate: d.parties?.petitionerAdvocates?.[i] || ''
// //           })),
// //           respondents: (d.parties?.respondents || [d.parties?.respondent].filter(Boolean)).map((r, i) => ({
// //             name: r,
// //             advocate: d.parties?.respondentAdvocates?.[i] || ''
// //           })),
// //           impleaders: (d.parties?.impleaderAdvocates || []).map(a => ({ name: '', advocate: a }))
// //         },
// //         hearings: (d.caseListing || []).map(l => ({
// //           date: l.causeListDate,
// //           bench: l.bench,
// //           type: l.listTypeSrNo
// //         })),
// //         orders: (d.orders || []).map(o => ({
// //           orderDate: o.orderDate,
// //           orderNumber: o.serialNo || '',
// //           orderType: 'Order',
// //           judgmentLink: o.orderLink
// //         })),
// //         relatedCases: (d.relatedCases || []).map(r => ({
// //           caseNumber: r.caseNo,
// //           description: r.description,
// //           link: r.link
// //         })),
// //         acts: (d.acts || []).map(a => ({ act: a.act, section: a.section })),
// //         copyApplications: (d.copyApplications || []).map(c => ({ ...c })),
// //         notices: (d.notices || []).map(n => ({
// //           serialNumber: n.serialNumber,
// //           processId: n.processId,
// //           noticeType: n.noticeType,
// //           name: n.name,
// //           stateDistrict: n.stateDistrict,
// //           station: n.station,
// //           issueDate: n.issueDate,
// //           returnableDate: n.returnableDate,
// //           dispatchDate: n.dispatchDate
// //         })),
// //         earlierCourt: (d.earlierCourtDetails || []).map(c => ({ ...c })),
// //         taggedMatters: (d.taggedMatters || []).map(t => ({ ...t })),
// //         additionalDetails: {
// //           district: d.caseDetails?.district || '',
// //           filingDate: extractDate(d.caseDetails?.diaryNumber, 'Filed') || d.caseDetails?.filingDate || '',
// //           filingNumber: d.caseDetails?.diaryNumber || '',
// //           mainCaseDetails: d.caseDetails?.mainCaseDetail || '',
// //           admittedDate: d.caseDetails?.admittedOn?.match(/ADMITTED ON\s*:\s*([\d-]+)/i)?.[1] || '',
// //           stateDistrict: d.caseDetails?.stateDistrict || '',
// //           filingCourtName: d.caseDetails?.filingCourtName || 'Delhi High Court'
// //         },
// //         metadata: {
// //           scrapedFrom: 'DLHC',
// //           scrapedAt: new Date().toISOString(),
// //           success: true,
// //           error: ''
// //         }
// //       };
// //     } catch (e) {
// //       return this.errorResponse('DLHC', e);
// //     }
// //   }
// //
// //   mapScResponse(d) {
// //     try {
// //       const extractDate = (text, prefix) =>
// //           text?.match(new RegExp(`${prefix}\\s*on\\s*([\\d-]+)`, 'i'))?.[1] || '';
// //
// //       return {
// //         caseInfo: {
// //           caseNumber: d.caseDetails?.caseNumber || '',
// //           caseType: '',
// //           registrationDate: extractDate(d.caseDetails?.caseNumber, 'Registered'),
// //           caseStatus: d.caseDetails?.statusStage || '',
// //           courtName: 'Supreme Court of India',
// //           category: d.caseDetails?.category || '',
// //           diaryNumber: d.caseDetails?.diaryNumber || '',
// //           cnrNumber: d.caseDetails?.cnrNumber || '',
// //           lastListedOn: d.caseDetails?.lastListedOn?.split('[')[0]?.trim() || '',
// //           nextListedOn: '',
// //           courtNumber: '',
// //           coramBench: d.caseDetails?.lastListedOn?.match(/\[(.*?)\]/)?.[1]?.trim() || ''
// //         },
// //         parties: {
// //           petitioners: (d.caseDetails?.petitioners || []).map((p, i) => ({
// //             name: p,
// //             advocate: d.caseDetails?.petitionerAdvocates?.[i] || ''
// //           })),
// //           respondents: (d.caseDetails?.respondents || []).map((r, i) => ({
// //             name: r,
// //             advocate: d.caseDetails?.respondentAdvocates?.[i] || ''
// //           })),
// //           impleaders: (d.caseDetails?.impleaderAdvocates || []).map(a => ({ name: '', advocate: a }))
// //         },
// //         hearings: [],
// //         orders: (d.judgmentOrders || []).map(o => ({
// //           orderDate: o.date,
// //           orderNumber: '',
// //           orderType: 'Order',
// //           judgmentLink: o.link
// //         })),
// //         relatedCases: [],
// //         acts: [],
// //         copyApplications: [],
// //         notices: (d.notices || []).map(n => ({
// //           serialNumber: n.serialNumber,
// //           processId: n.processId,
// //           noticeType: n.noticeType,
// //           name: n.name,
// //           stateDistrict: n.stateDistrict,
// //           station: n.station,
// //           issueDate: n.issueDate,
// //           returnableDate: n.returnableDate,
// //           dispatchDate: n.dispatchDate
// //         })),
// //         earlierCourt: (d.earlierCourtDetails || []).map(c => ({ ...c })),
// //         taggedMatters: (d.taggedMatters || []).map(t => ({ ...t })),
// //         additionalDetails: {
// //           district: '',
// //           filingDate: extractDate(d.caseDetails?.diaryNumber, 'Filed'),
// //           filingNumber: d.caseDetails?.diaryNumber || '',
// //           mainCaseDetails: d.caseDetails?.caseTitle || '',
// //           admittedDate: d.caseDetails?.admittedOn?.match(/ADMITTED ON\s*:\s*([\d-]+)/i)?.[1] || '',
// //           stateDistrict: '',
// //           filingCourtName: ''
// //         },
// //         metadata: {
// //           scrapedFrom: 'SC',
// //           scrapedAt: new Date().toISOString(),
// //           success: true,
// //           error: ''
// //         }
// //       };
// //     } catch (e) {
// //       return this.errorResponse('SC', e);
// //     }
// //   }
// //
// //   mapPhhcResponse(d) {
// //     try {
// //       const extractDate = (text, prefix) =>
// //           text?.match(new RegExp(`${prefix}\\s*on\\s*([\\d-]+)`, 'i'))?.[1] || '';
// //
// //       // Parse parties string to extract multiple petitioners/respondents like SC format
// //       const parseParties = (partyDetail) => {
// //         if (!partyDetail) return { petitioners: [], respondents: [] };
// //
// //         const vsSeparators = /\s+(?:vs\.?|v\/s|versus)\s+/i;
// //         const parts = partyDetail.split(vsSeparators);
// //
// //         const petitioners = parts[0] ? parts[0].split(/,|&|\band\b/).map(p => p.trim()).filter(p => p) : [];
// //         const respondents = parts[1] ? parts[1].split(/,|&|\band\b/).map(r => r.trim()).filter(r => r) : [];
// //
// //         return { petitioners, respondents };
// //       };
// //
// //       const parsedParties = parseParties(d.caseDetails?.partyDetail);
// //
// //       return {
// //         caseInfo: {
// //           caseNumber: d.caseDetails?.mainCaseDetail || '',
// //           caseType: '',
// //           registrationDate: extractDate(d.caseDetails?.mainCaseDetail, 'Registered') || d.caseDetails?.registrationDate || '',
// //           caseStatus: d.caseDetails?.status || '',
// //           courtName: 'Punjab & Haryana High Court',
// //           category: d.caseDetails?.category || '',
// //           diaryNumber: d.caseDetails?.diaryNumber || '',
// //           cnrNumber: d.caseDetails?.cnrNumber || '',
// //           lastListedOn: d.caseDetails?.lastListedOn?.split('[')[0]?.trim() || '',
// //           nextListedOn: '',
// //           courtNumber: '',
// //           coramBench: d.caseDetails?.lastListedOn?.match(/\[(.*?)\]/)?.[1]?.trim() || ''
// //         },
// //         parties: {
// //           petitioners: parsedParties.petitioners.map((p, i) => ({
// //             name: p,
// //             advocate: d.caseDetails?.advocateName || ''
// //           })),
// //           respondents: parsedParties.respondents.map((r, i) => ({
// //             name: r,
// //             advocate: d.caseDetails?.respondentAdvocates?.[i] || ''
// //           })),
// //           impleaders: (d.caseDetails?.impleaderAdvocates || []).map(a => ({ name: '', advocate: a }))
// //         },
// //         hearings: [],
// //         orders: (d.judgments || []).map(j => ({
// //           orderDate: j.orderDate,
// //           orderNumber: '',
// //           orderType: 'Order',
// //           judgmentLink: j.judgmentLink
// //         })),
// //         relatedCases: [],
// //         acts: [],
// //         copyApplications: [],
// //         notices: (d.notices || []).map(n => ({
// //           serialNumber: n.serialNumber,
// //           processId: n.processId,
// //           noticeType: n.noticeType,
// //           name: n.name,
// //           stateDistrict: n.stateDistrict,
// //           station: n.station,
// //           issueDate: n.issueDate,
// //           returnableDate: n.returnableDate,
// //           dispatchDate: n.dispatchDate
// //         })),
// //         earlierCourt: (d.earlierCourtDetails || []).map(c => ({ ...c })),
// //         taggedMatters: (d.taggedMatters || []).map(t => ({ ...t })),
// //         additionalDetails: {
// //           district: d.caseDetails?.district || '',
// //           filingDate: extractDate(d.caseDetails?.diaryNumber, 'Filed') || d.caseDetails?.filingDate || '',
// //           filingNumber: d.caseDetails?.diaryNumber || '',
// //           mainCaseDetails: d.caseDetails?.mainCaseDetail || '',
// //           admittedDate: d.caseDetails?.admittedOn?.match(/ADMITTED ON\s*:\s*([\d-]+)/i)?.[1] || '',
// //           stateDistrict: '',
// //           filingCourtName: ''
// //         },
// //         metadata: {
// //           scrapedFrom: 'PHHC',
// //           scrapedAt: new Date().toISOString(),
// //           success: true,
// //           error: ''
// //         }
// //       };
// //     } catch (e) {
// //       return this.errorResponse('PHHC', e);
// //     }
// //   }
// //
// //   mapEservicesResponse(d) {
// //     try {
// //       const extractDate = (text, prefix) =>
// //           text?.match(new RegExp(`${prefix}\\s*on\\s*([\\d-]+)`, 'i'))?.[1] || '';
// //
// //       const c = d.caseDetails || {};
// //
// //       return {
// //         caseInfo: {
// //           caseNumber: c['Case Number'] || '',
// //           caseType: '',
// //           registrationDate: extractDate(c['Case Number'], 'Registered') || c['Registration Date'] || '',
// //           caseStatus: d.caseStatus?.['Case Status'] || '',
// //           courtName: d.courtName || '',
// //           category: c['Case Category'] || '',
// //           diaryNumber: c['Filing Number'] || '',
// //           cnrNumber: c['CNR Number'] || '',
// //           lastListedOn: d.lastListedOn?.split('[')[0]?.trim() || '',
// //           nextListedOn: '',
// //           courtNumber: '',
// //           coramBench: d.lastListedOn?.match(/\[(.*?)\]/)?.[1]?.trim() || ''
// //         },
// //         parties: {
// //           petitioners: (d.petitioner || []).map((p, i) => ({
// //             name: p,
// //             advocate: d.petitionerAdvocates?.[i] || ''
// //           })),
// //           respondents: (d.respondent || []).map((r, i) => ({
// //             name: r,
// //             advocate: d.respondentAdvocates?.[i] || ''
// //           })),
// //           impleaders: (d.impleaderAdvocates || []).map(a => ({ name: '', advocate: a }))
// //         },
// //         hearings: [],
// //         orders: (d.orders || []).map(o => ({
// //           orderDate: o.orderDate,
// //           orderNumber: '',
// //           orderType: 'Order',
// //           judgmentLink: o.orderLink
// //         })),
// //         relatedCases: [],
// //         acts: [],
// //         copyApplications: [],
// //         notices: (d.notices || []).map(n => ({
// //           serialNumber: n.serialNumber,
// //           processId: n.processId,
// //           noticeType: n.noticeType,
// //           name: n.name,
// //           stateDistrict: n.stateDistrict,
// //           station: n.station,
// //           issueDate: n.issueDate,
// //           returnableDate: n.returnableDate,
// //           dispatchDate: n.dispatchDate
// //         })),
// //         earlierCourt: (d.earlierCourtDetails || []).map(c => ({ ...c })),
// //         taggedMatters: (d.taggedMatters || []).map(t => ({ ...t })),
// //         additionalDetails: {
// //           district: c['District'] || '',
// //           filingDate: extractDate(c['Filing Number'], 'Filed') || c['Filing Date'] || '',
// //           filingNumber: c['Filing Number'] || '',
// //           mainCaseDetails: c['Case Title'] || '',
// //           admittedDate: c['Admitted On']?.match(/ADMITTED ON\s*:\s*([\d-]+)/i)?.[1] || '',
// //           stateDistrict: '',
// //           filingCourtName: c['Court Name'] || ''
// //         },
// //         metadata: {
// //           scrapedFrom: 'eServices',
// //           scrapedAt: new Date().toISOString(),
// //           success: true,
// //           error: ''
// //         }
// //       };
// //     } catch (e) {
// //       return this.errorResponse('eServices', e);
// //     }
// //   }
// //
// //   errorResponse(source, error) {
// //     return {
// //       caseInfo: {},
// //       parties: { petitioners: [], respondents: [], impleaders: [] },
// //       hearings: [],
// //       orders: [],
// //       relatedCases: [],
// //       acts: [],
// //       copyApplications: [],
// //       notices: [],
// //       earlierCourt: [],
// //       taggedMatters: [],
// //       additionalDetails: {},
// //       metadata: {
// //         scrapedFrom: source,
// //         scrapedAt: new Date().toISOString(),
// //         success: false,
// //         error: error.message || error.toString()
// //       }
// //     };
// //   }
// // }
// //
// // export default new ScrapperResponseMapper();

class ScrapperResponseMapper {

  // Centralized Date Extraction utility
  extractDate(text, patterns = []) {
    if (!text) return '';

    const defaultPatterns = [
      /(\d{2}[-/.]\d{2}[-/.]\d{4})/,           // DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY
      /(\d{4}[-/.]\d{2}[-/.]\d{2})/,           // YYYY-MM-DD, YYYY/MM/DD
      /(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})/,       // D-M-YYYY variations
      /registered\s*on\s*([\d-/.]+)/i,         // "Registered on DATE"
      /filed\s*on\s*([\d-/.]+)/i,              // "Filed on DATE"
      /admitted\s*on\s*:?\s*([\d-/.]+)/i       // "Admitted on: DATE"
    ];

    const allPatterns = [...defaultPatterns, ...patterns];

    for (const pattern of allPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return '';
  }

  // Standardized Party Mapping
  mapParty(name, advocate = '', type = '') {
    return {
      name: name || '',
      advocate: advocate || '',
      advocates: advocate ? [advocate] : [],
      type: type,
      address: '',
      contact: ''
    };
  }

  mapDlhcResponse(d) {
    try {
      return {
        caseInfo: {
          caseNumber: d.caseDetails?.mainCaseDetail || '',
          caseType: d.caseDetails?.category || '',
          registrationDate: this.extractDate(d.caseDetails?.registrationDate) || d.caseDetails?.registrationDate || '',
          caseStatus: d.caseDetails?.status || '',
          courtName: 'Delhi High Court',
          category: d.caseDetails?.category || '',
          diaryNumber: d.caseDetails?.diaryNumber || '',
          cnrNumber: '',
          lastListedOn: '',
          nextListedOn: this.extractDate(d.listingInfo?.nextDate) || d.listingInfo?.nextDate || '',
          courtNumber: d.listingInfo?.courtNumber || '',
          coramBench: ''
        },
        parties: {
          petitioners: [this.mapParty(d.parties?.petitioner, '', 'petitioner')],
          respondents: [this.mapParty(d.parties?.respondent, '', 'respondent')],
          impleaders: []
        },
        hearings: (d.caseListing || []).map(l => ({
          date: l.causeListDate || '',
          bench: l.bench || '',
          type: l.listTypeSrNo || '',
          purpose: '',
          nextDate: '',
          courtNumber: '',
          remarks: ''
        })),
        orders: (d.orders || []).map(o => ({
          orderDate: o.orderDate || '',
          orderNumber: o.serialNo || '',
          orderType: 'Order',
          judgmentLink: o.orderLink || '',
          orderDetails: '',
          corrigendumLink: o.corrigendumLink || '',
          hindiOrderLink: o.hindiOrder || '',
          downloadUrl: o.orderLink || '',
          isJudgment: false
        })),
        relatedCases: (d.relatedCases || []).map(r => ({
          caseNumber: r.caseNo,
          description: r.description,
          link: r.link
        })),
        acts: [],
        copyApplications: [],
        notices: [],
        earlierCourt: [],
        taggedMatters: [],
        additionalDetails: {
          district: d.caseDetails?.district || '',
          filingDate: this.extractDate(d.caseDetails?.filingDate) || '',
          filingNumber: '',
          mainCaseDetails: d.caseDetails?.mainCaseDetail || '',
          admittedDate: '',
          stateDistrict: '',
          filingCourtName: ''
        },
        metadata: {
          scrapedFrom: 'DLHC',
          scrapedAt: new Date().toISOString(),
          success: true,
          error: ''
        }
      };
    } catch (e) {
      return this.errorResponse('DLHC', e);
    }
  }

  mapScResponse(d) {
    try {
      return {
        caseInfo: {
          caseNumber: d.caseDetails?.caseNumber || '',
          caseType: '',
          registrationDate: this.extractDate(d.caseDetails?.caseNumber, [/registered\s*on\s*([\d-]+)/i]) || '',
          caseStatus: d.caseDetails?.statusStage || '',
          courtName: 'Supreme Court of India',
          category: d.caseDetails?.category || '',
          diaryNumber: d.caseDetails?.diaryNumber || '',
          cnrNumber: d.caseDetails?.cnrNumber || '',
          lastListedOn: d.caseDetails?.lastListedOn?.split('[')[0]?.trim() || '',
          nextListedOn: '',
          courtNumber: '',
          coramBench: d.caseDetails?.lastListedOn?.match(/\[(.*?)\]/)?.[1]?.trim() || ''
        },
        parties: {
          petitioners: (d.caseDetails?.petitioners || []).map((p, i) =>
              this.mapParty(p, d.caseDetails?.petitionerAdvocates?.[i] || '', 'petitioner')
          ),
          respondents: (d.caseDetails?.respondents || []).map((r, i) =>
              this.mapParty(r, d.caseDetails?.respondentAdvocates?.[i] || '', 'respondent')
          ),
          impleaders: (d.caseDetails?.impleaderAdvocates || []).map(a =>
              this.mapParty('', a, 'impleader')
          )
        },
        hearings: [], // SC doesn't provide hearing data, keeping empty with standard structure
        orders: (d.judgmentOrders || []).map(o => ({
          orderDate: o.date || '',
          orderNumber: '',
          orderType: 'Order',
          judgmentLink: o.link || '',
          orderDetails: '',
          corrigendumLink: '',
          hindiOrderLink: '',
          downloadUrl: o.link || '',
          isJudgment: false
        })),
        relatedCases: [],
        acts: [],
        copyApplications: [],
        notices: (d.notices || []).map(n => ({
          serialNumber: n.serialNumber,
          processId: n.processId,
          noticeType: n.noticeType,
          name: n.name,
          stateDistrict: n.stateDistrict,
          station: n.station,
          issueDate: n.issueDate,
          returnableDate: n.returnableDate,
          dispatchDate: n.dispatchDate
        })),
        earlierCourt: (d.earlierCourtDetails || []).map(c => ({ ...c })),
        taggedMatters: (d.taggedMatters || []).map(t => ({ ...t })),
        additionalDetails: {
          district: '',
          filingDate: this.extractDate(d.caseDetails?.diaryNumber, [/filed\s*on\s*([\d-]+)/i]) || '',
          filingNumber: d.caseDetails?.diaryNumber || '',
          mainCaseDetails: d.caseDetails?.caseTitle || '',
          admittedDate: this.extractDate(d.caseDetails?.admittedOn, [/admitted\s*on\s*:\s*([\d-]+)/i]) || '',
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
    } catch (e) {
      return this.errorResponse('SC', e);
    }
  }

  mapPhhcResponse(d) {
    try {
      return {
        caseInfo: {
          caseNumber: d.caseDetails?.mainCaseDetail || '',
          caseType: '',
          registrationDate: this.extractDate(d.caseDetails?.registrationDate) || d.caseDetails?.registrationDate || '',
          caseStatus: d.caseDetails?.status || '',
          courtName: 'Punjab & Haryana High Court',
          category: d.caseDetails?.category || '',
          diaryNumber: d.caseDetails?.diaryNumber || '',
          cnrNumber: '',
          lastListedOn: '',
          nextListedOn: '',
          courtNumber: '',
          coramBench: ''
        },
        parties: {
          petitioners: [this.mapParty(
              d.caseDetails?.partyDetail || '',
              d.caseDetails?.advocateName || '',
              'petitioner'
          )],
          respondents: [],
          impleaders: []
        },
        hearings: (d.caseListing || []).map(l => ({
          date: l.causeListDate || '',
          bench: l.bench || '',
          type: l.listTypeSrNo || '',
          purpose: '',
          nextDate: '',
          courtNumber: '',
          remarks: ''
        })),
        orders: (d.judgments || []).map(j => ({
          orderDate: j.orderDate || '',
          orderNumber: j.orderCaseId || '',
          orderType: 'Judgment',
          judgmentLink: j.judgmentLink || '',
          orderDetails: '',
          corrigendumLink: '',
          hindiOrderLink: '',
          downloadUrl: j.judgmentLink || '',
          isJudgment: true
        })),
        relatedCases: (d.relatedCases || []).map(r => ({
          caseNumber: r.caseNo,
          description: r.description,
          link: r.link
        })),
        acts: [],
        copyApplications: (d.copyPetitions || []).map(c => ({ ...c })),
        notices: [],
        earlierCourt: [],
        taggedMatters: [],
        additionalDetails: {
          district: d.caseDetails?.district || '',
          filingDate: '',
          filingNumber: '',
          mainCaseDetails: d.caseDetails?.mainCaseDetail || '',
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
    } catch (e) {
      return this.errorResponse('PHHC', e);
    }
  }

  mapEservicesResponse(d) {
    try {
      const c = d.caseDetails || {};
      return {
        caseInfo: {
          caseNumber: c['Case Number'] || '',
          caseType: c['Case Type'] || '',
          registrationDate: this.extractDate(c['Registration Date']) || c['Registration Date'] || '',
          caseStatus: d.caseStatus?.['Case Status'] || '',
          courtName: d.courtName || '',
          category: c['Case Category'] || '',
          diaryNumber: c['Filing Number'] || '',
          cnrNumber: '',
          lastListedOn: '',
          nextListedOn: '',
          courtNumber: '',
          coramBench: ''
        },
        parties: {
          petitioners: (d.petitioner || []).map(p => this.mapParty(p, '', 'petitioner')),
          respondents: (d.respondent || []).map(r => this.mapParty(r, '', 'respondent')),
          impleaders: []
        },
        hearings: (d.caseHistory || []).map(h => ({
          date: h.businessDate || '',
          bench: h.judge || '',
          type: '',
          purpose: h.purpose || '',
          nextDate: h.hearingDate || '',
          courtNumber: '',
          remarks: ''
        })),
        orders: (d.orders || []).map(o => ({
          orderDate: o.orderDate || '',
          orderNumber: o.orderNumber || '',
          orderType: 'Order',
          judgmentLink: '',
          orderDetails: o.orderDetails || '',
          corrigendumLink: '',
          hindiOrderLink: '',
          downloadUrl: '',
          isJudgment: false
        })),
        relatedCases: [],
        acts: (d.acts || []).map(a => ({ act: a.act, section: a.section })),
        copyApplications: [],
        notices: [],
        earlierCourt: [],
        taggedMatters: [],
        additionalDetails: {
          district: c['District'] || '',
          filingDate: this.extractDate(c['Filing Date']) || c['Filing Date'] || '',
          filingNumber: c['Filing Number'] || '',
          mainCaseDetails: '',
          admittedDate: '',
          stateDistrict: '',
          filingCourtName: c['Court Name'] || ''
        },
        metadata: {
          scrapedFrom: 'eServices',
          scrapedAt: new Date().toISOString(),
          success: true,
          error: ''
        }
      };
    } catch (e) {
      return this.errorResponse('eServices', e);
    }
  }

  errorResponse(source, error) {
    return {
      caseInfo: {},
      parties: { petitioners: [], respondents: [], impleaders: [] },
      hearings: [],
      orders: [],
      relatedCases: [],
      acts: [],
      copyApplications: [],
      notices: [],
      earlierCourt: [],
      taggedMatters: [],
      additionalDetails: {},
      metadata: {
        scrapedFrom: source,
        scrapedAt: new Date().toISOString(),
        success: false,
        error: error.message || error.toString()
      }
    };
  }
}

export default new ScrapperResponseMapper();