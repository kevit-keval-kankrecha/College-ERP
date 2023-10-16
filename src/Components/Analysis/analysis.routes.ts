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

         //get Analysis
         this.router.post('/getAbsentStudentBatchYearSemesterDateWise', this.analysisController.getAbsentStudentBatchYearSemesterDateWise);

          //get Analysis
          this.router.post('/getMoreThen75PercentStudent', this.analysisController.getMoreThen75PercentStudent);
    }

}

export default new analysisRoutes().router