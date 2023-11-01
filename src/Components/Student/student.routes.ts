import { Router } from 'express';

import studentController from './student.controller';
import authentication from '../../utils/authentication';
import {authorization} from '../../utils/authorization';

class studentRoutes {
  public router: Router;

  studentController = new studentController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    //Create New Student
    this.router.post('/add', authentication, authorization(['Admin','Faculty']), this.studentController.createStudent);

    //Login Student
    this.router.post('/login', this.studentController.loginStudent);

    //LogOut Students
    this.router.post('/logout', authentication, this.studentController.logOutStudent);

    //List Student
    this.router.get('/', authentication, authorization(['Admin','Faculty']), this.studentController.getStudents);

    //Update Student
    this.router.patch('/update/:id?', authentication, authorization(['Admin','Faculty']), this.studentController.updateStudent);

    //Delete Student
    this.router.delete('/delete/:id?', authentication, authorization(['Admin','Faculty']), this.studentController.deleteStudent);

    //Get Profile
    this.router.get('/me', authentication,  this.studentController.getProfile);

    //Student Analysis Routes

    //get Batch and year wise Analysis
    this.router.get('/getBatchDepartmentWiseStudents', authentication, authorization(['Admin','Faculty']) ,this.studentController.getBatchDepartmentWiseData);

    //get Absent Student
    this.router.post('/getAbsentStudents', authentication, authorization(['Admin','Faculty']), this.studentController.getAbsentStudentBatchYearSemesterDateWise);

    //get present Students
    this.router.post('/getMoreThen75PercentAttendanceStudent', authentication, authorization(['Admin','Faculty']), this.studentController.getMoreThen75PercentStudent);

    //get present Students
    this.router.post('/getVacancySeat', authentication, authorization(['Admin','Faculty']), this.studentController.getVacancySeat);
  }
}

export default new studentRoutes().router;
