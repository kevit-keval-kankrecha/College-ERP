import { Router } from "express";
import analysisController from './analysis.controller';
import authentication from '../../utils/authentication';
import authorization from '../../utils/authorization';

class analysisRoutes {
    public router: Router;

    analysisController = new analysisController();

    constructor() {
        this.router = Router();
        this.initalizeRoutes();
    }

    initalizeRoutes() {
        //get Analysis
        this.router.get('/getBatchDepartmentWiseData', this.analysisController.getBatchDepartmentWiseData);
    }

}

export default new analysisRoutes().router