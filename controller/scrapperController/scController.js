
import httpError from "http-errors";
import logger from "../../util/logger/logger.js";
import { z } from "zod";
import dlhcScrapper from "../../services/scrapper/dlhc/dlhcScrapper.js";
import scScrapper from "../../services/scrapper/sc/scScrapper.js";

const caseDataSchema = z.object({
    caseType: z.string().min(1),
    caseNumber: z.string().min(1),
    caseYear: z.string().min(1)
});

class scController {

    async getCaseData(req, res) {

        const { caseType,caseNumber,caseYear } = caseDataSchema.parse(req.params);

        if (!caseNumber || !caseType || !caseYear) {
            throw httpError.BadRequest('info is required');
        }

        try {
            const caseData = await scScrapper.getCaseData(caseType,caseNumber,caseYear);
            res.status(200).json(caseData);
        } catch (error) {
            logger.error('Error fetching case data:', error);
            throw httpError.InternalServerError('Failed to fetch case data');
        }
    }
}

export default new scController();