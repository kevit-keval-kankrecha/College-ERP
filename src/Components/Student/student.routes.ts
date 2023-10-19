import { Router } from 'express';

import studentController from './student.controller';
import authentication from '../../utils/authentication';
import authorization from '../../utils/authorization';

class studentRoutes {
  public router: Router;

  studentController = new studentController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    //Create New Student
    this.router.post('/add', authentication, authorization, this.studentController.createStudent);

    //Login Student
    this.router.post('/login', this.studentController.loginStudent);

    //LogOut Students
    this.router.post('/logout', authentication, authorization, this.studentController.logOutStudent);

    //List Student
    this.router.get('/', authentication, authorization, this.studentController.getStudents);

    //Update Student
    this.router.patch('/update/:id?', authentication, authorization, this.studentController.updateStudent);

    //Delete Student
    this.router.delete('/delete/:id?', authentication, authorization, this.studentController.deleteStudent);

    //Get Profile
    this.router.get('/me', authentication, authorization, this.studentController.getProfile);

    //Student Analysis Routes

    //get Batch and year wise Analysis
    this.router.get('/getBatchDepartmentWiseStudents', this.studentController.getBatchDepartmentWiseData);

    //get Absent Student
    this.router.post('/getAbsentStudents', this.studentController.getAbsentStudentBatchYearSemesterDateWise);

    //get present Students
    this.router.post('/getMoreThen75PercentAttendanceStudent', this.studentController.getMoreThen75PercentStudent);

    //get present Students
    this.router.get('/getVacancySeat', this.studentController.getVacancySeat);
  }
}

export default new studentRoutes().router;
