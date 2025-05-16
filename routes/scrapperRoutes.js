import { Router } from 'express';
import controllerMapper from '../controller/scrapperController/controllerMapper.js';

const router = Router();

class ScrapperRoutes {
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/scrapper/eservices/:cnrNumber', controllerMapper.eservices.getCaseData);

        this.router.get('/scrapper/phhc/:caseType/:caseNumber/:caseYear', controllerMapper.phhc.getCaseData);

        this.router.get('/scrapper/dlhc/:caseType/:caseNumber/:caseYear', controllerMapper.dlhc.getCaseData);

        this.router.get('/scrapper/sc/:caseType/:caseNumber/:caseYear', controllerMapper.sc.getCaseData);
    }

    getRouter() {
        return this.router;
    }
}

export default new ScrapperRoutes().getRouter();