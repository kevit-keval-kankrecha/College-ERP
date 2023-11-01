import { Router } from 'express';

import departmentController from './department.controller';
import authentication from '../../utils/authentication';
import {authorization} from '../../utils/authorization';

class departmentRoutes {
  public router: Router;

  departmentController = new departmentController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    //Create Department
    this.router.post('/add', authentication, authorization(['Admin']), this.departmentController.createDepartment);

    //List Departments
    this.router.get('/', authentication, authorization(['Admin']), this.departmentController.getDepartments);

    //Update Department By Id
    this.router.patch('/update/:id', authentication, authorization(['Admin']), this.departmentController.updateDepartment);

    //Delete Department By Id
    this.router.delete('/delete/:id', authentication, authorization(['Admin']), this.departmentController.deleteDepartment);
  }
}

export default new departmentRoutes().router;
