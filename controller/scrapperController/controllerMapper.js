import eservicesController from "./eservicesController.js";
import phhcController from "./phhcController.js";
import dlhcController from "./dlhcController.js";
import scController from "./scController.js";

export const controllerMapper = {
    eservices: eservicesController,
    phhc: phhcController,
    dlhc: dlhcController,
    sc: scController
}

export default controllerMapper;