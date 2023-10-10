import { Router } from "express";
import departmentController from './department.controller';

class departmentRoutes {
    public router:Router;

    departmentController = new departmentController();

    constructor(){
        this.router=Router();
        this.initalizeRoutes();
    }

    initalizeRoutes(){
        //Create Department
        this.router.post('/add',this.departmentController.createDepartment);

        //List Departments
        this.router.get('/',this.departmentController.getDepartments);

        //Update Departments
        this.router.patch('/update/:id',this.departmentController.updateDepartment);

        //Delete Departments
        this.router.delete('/delete/:id',this.departmentController.deleteDepartment);
    }

}

export default new departmentRoutes().router