import { Router } from 'express';

import attendanceController from './attendance.controller';
import authentication from '../../utils/authentication';
import authorization from '../../utils/authorization';

class attendanceRoutes {
  public router: Router;

  attendanceController = new attendanceController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    //Student Attendance
    this.router.post('/add', authentication, authorization, this.attendanceController.fillAttendance);
  }
}

export default new attendanceRoutes().router;
