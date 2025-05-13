import eservicesScrapper from "../../services/scrapper/eservices/eservicesScrapper.js"; 
import httpError from "http-errors";
import logger from "../../util/logger/logger.js";
import { z } from "zod";

const caseDataSchema = z.object({
    cnrNumber: z.string().min(1)
});

class EservicesController {

    async getCaseData(req, res) {

        const { cnrNumber } = caseDataSchema.parse(req.params);

        if (!cnrNumber) {
            throw httpError.BadRequest('CNr number is required');
        }

        try {
            const caseData = await eservicesScrapper.getCaseData(cnrNumber);
            res.status(200).json(caseData);
        } catch (error) {
            logger.error('Error fetching case data:', error);
            throw httpError.InternalServerError('Failed to fetch case data');
        }
    }
}

export default new EservicesController();