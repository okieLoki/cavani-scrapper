
import httpError from "http-errors";
import logger from "../../util/logger/logger.js";
import { z } from "zod";
import phhcScrapper from "../../services/scrapper/phhc/phhcScrapper.js";
import { phhcCaseTypes } from "../../util/case-types/phhcCaseTypes.js";

const caseDataSchema = z.object({
    caseType: z.string().min(1),
    caseNumber: z.string().min(1),
    caseYear: z.string().min(1)
});

class phhcController {

    async getCaseData(req, res) {

        const { caseType,caseNumber,caseYear } = caseDataSchema.parse(req.params);

        if(!phhcCaseTypes.includes(caseType)) {
            throw httpError.BadRequest('Invalid case type');
        }

        if(caseYear > new Date().getFullYear() || caseYear < 1960) {
            throw httpError.BadRequest('Invalid case year');
        }

        if (!caseNumber || !caseType || !caseYear) {
            throw httpError.BadRequest('info is required');
        }

        try {
            const caseData = await phhcScrapper.getCaseData(caseType,caseNumber,caseYear);
            res.status(200).json(caseData);
        } catch (error) {
            logger.error('Error fetching case data:', error);
            throw httpError.InternalServerError('Failed to fetch case data');
        }
    }
}

export default new phhcController();