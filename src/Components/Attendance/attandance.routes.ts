import { Router } from "express";
import attendanceController from './attandance.controller';
import authentication from '../../utils/authentication';
import authorization from '../../utils/authorization';

class attendanceRoutes {
    public router: Router;

    attendanceController = new attendanceController();

    constructor() {
        this.router = Router();
        this.initalizeRoutes();
    }

    initalizeRoutes() {
        //Student Attendance
        this.router.post('/add', authentication, authorization, this.attendanceController.fillAttendance);    
    }

}

export default new attendanceRoutes().router