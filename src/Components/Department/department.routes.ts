import { Router } from "express";
import departmentController from './department.controller';
import authentication from "../../utils/authentication";
import authorization from "../../utils/authorization";

class departmentRoutes {
    public router: Router;

    departmentController = new departmentController();

    constructor() {
        this.router = Router();
        this.initalizeRoutes();
    }

    initalizeRoutes() {
        //Create Department
        this.router.post('/add', authentication,authentication, this.departmentController.createDepartment);

        //List Departments
        this.router.get('/', authentication, authorization, this.departmentController.getDepartments);

        //Update Departments
        this.router.patch('/update/', authentication, authorization, this.departmentController.updateDepartment);

        //Delete Departments
        this.router.delete('/delete/', authentication, authorization, this.departmentController.deleteDepartment);
    }

}

export default new departmentRoutes().router