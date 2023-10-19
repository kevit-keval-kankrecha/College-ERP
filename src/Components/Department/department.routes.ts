import { Router } from "express";


import departmentController from './department.controller';
import authentication from '../../utils/authentication';
import authorization from '../../utils/authorization';

class departmentRoutes {
  public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        //Create Department
        this.router.post('/add', authentication,authorization, this.departmentController.createDepartment);


  initializeRoutes() {
    //Create Department
    this.router.post('/add', authentication, authorization, this.departmentController.createDepartment);

        //Update Department By Id
        this.router.patch('/update/:id', authentication, authorization, this.departmentController.updateDepartment);

        //Delete Department By Id
        this.router.delete('/delete/:id', authentication, authorization, this.departmentController.deleteDepartment);
    }


    //Delete Department By Id
    this.router.delete('/delete/:id', authentication, authorization, this.departmentController.deleteDepartment);
  }
}

export default new departmentRoutes().router;
