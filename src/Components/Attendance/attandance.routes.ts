import { Router } from "express";
import studentController from './attandance.controller';
import authentication from '../../utils/authentication';
import authorization from '../../utils/authorization';

class attendanceRoutes {
    public router: Router;

    attendanceController = new studentController();

    constructor() {
        this.router = Router();
        this.initalizeRoutes();
    }

    initalizeRoutes() {
        //Student Attendance
        this.router.post('/add', authentication, authorization, this.attendanceController.fillAttendance);

        //get Analysis
        this.router.get('/getBatchDepartmentWiseData', this.attendanceController.getBatchDepartmentWiseData);
        
    }

}

export default new attendanceRoutes().router