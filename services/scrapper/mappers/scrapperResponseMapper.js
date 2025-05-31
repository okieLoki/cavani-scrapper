class ScrapperResponseMapper {
    mapDlhcResponse(d) {
      try {
        return {
          caseInfo: {
            caseNumber: d.caseDetails?.mainCaseDetail || '',
            caseType: d.caseDetails?.category || '',
            registrationDate: d.caseDetails?.registrationDate || '',
            caseStatus: d.caseDetails?.status || '',
            courtName: 'Delhi High Court',
            category: d.caseDetails?.category || '',
            diaryNumber: d.caseDetails?.diaryNumber || '',
            cnrNumber: '',
            lastListedOn: '',
            nextListedOn: d.listingInfo?.nextDate || '',
            courtNumber: d.listingInfo?.courtNumber || '',
            coramBench: ''
          },
          parties: {
            petitioners: [{ name: d.parties?.petitioner || '', advocate: '' }],
            respondents: [{ name: d.parties?.respondent || '', advocate: '' }],
            impleaders: []
          },
          hearings: (d.caseListing || []).map(l => ({
            date: l.causeListDate,
            bench: l.bench,
            type: l.listTypeSrNo
          })),
          orders: (d.orders || []).map(o => ({
            orderDate: o.orderDate,
            orderNumber: o.serialNo,
            orderType: 'Order',
            judgmentLink: o.orderLink,
            corrigendumLink: o.corrigendumLink,
            hindiOrderLink: o.hindiOrder
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
            filingDate: '',
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
        const extractDate = (text, prefix) =>
          text?.match(new RegExp(`${prefix}\\s*on\\s*([\\d-]+)`, 'i'))?.[1] || '';
  
        return {
          caseInfo: {
            caseNumber: d.caseDetails?.caseNumber || '',
            caseType: '',
            registrationDate: extractDate(d.caseDetails?.caseNumber, 'Registered'),
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
            petitioners: (d.caseDetails?.petitioners || []).map((p, i) => ({
              name: p,
              advocate: d.caseDetails?.petitionerAdvocates?.[i] || ''
            })),
            respondents: (d.caseDetails?.respondents || []).map((r, i) => ({
              name: r,
              advocate: d.caseDetails?.respondentAdvocates?.[i] || ''
            })),
            impleaders: (d.caseDetails?.impleaderAdvocates || []).map(a => ({ name: '', advocate: a }))
          },
          hearings: [],
          orders: (d.judgmentOrders || []).map(o => ({
            orderDate: o.date,
            orderNumber: '',
            orderType: 'Order',
            judgmentLink: o.link
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
            filingDate: extractDate(d.caseDetails?.diaryNumber, 'Filed'),
            filingNumber: d.caseDetails?.diaryNumber || '',
            mainCaseDetails: d.caseDetails?.caseTitle || '',
            admittedDate: d.caseDetails?.admittedOn?.match(/ADMITTED ON\s*:\s*([\d-]+)/i)?.[1] || '',
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
            caseType: d.caseDetails?.category || '',
            registrationDate: d.caseDetails?.registrationDate || '',
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
            petitioners: [{
              name: d.caseDetails?.partyDetail || '',
              advocate: d.caseDetails?.advocateName || ''
            }],
            respondents: [],
            impleaders: []
          },
          hearings: (d.caseListing || []).map(l => ({
            date: l.causeListDate,
            bench: l.bench,
            type: l.listTypeSrNo
          })),
          orders: (d.judgments || []).map(j => ({
            orderDate: j.orderDate,
            orderNumber: j.orderCaseId,
            orderType: 'Judgment',
            judgmentLink: j.judgmentLink
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
            registrationDate: c['Registration Date'] || '',
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
            petitioners: (d.petitioner || []).map(p => ({ name: p, advocate: '' })),
            respondents: (d.respondent || []).map(r => ({ name: r, advocate: '' })),
            impleaders: []
          },
          hearings: (d.caseHistory || []).map(h => ({
            date: h.businessDate,
            bench: h.judge,
            purpose: h.purpose,
            nextDate: h.hearingDate
          })),
          orders: (d.orders || []).map(o => ({
            orderDate: o.orderDate,
            orderNumber: o.orderNumber,
            orderType: 'Order',
            orderDetails: o.orderDetails
          })),
          relatedCases: [],
          acts: (d.acts || []).map(a => ({ act: a.act, section: a.section })),
          copyApplications: [],
          notices: [],
          earlierCourt: [],
          taggedMatters: [],
          additionalDetails: {
            district: c['District'] || '',
            filingDate: c['Filing Date'] || '',
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
  