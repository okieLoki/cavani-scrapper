import eservicesController from "./eservicesController.js";
import phhcController from "./phhcController.js";
import dlhcController from "./dlhcController.js";

export const controllerMapper = {
    eservices: eservicesController,
    phhc: phhcController,
    dlhc: dlhcController
}

export default controllerMapper;