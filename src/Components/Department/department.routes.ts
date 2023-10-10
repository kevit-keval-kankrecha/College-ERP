import { Router } from "express";
import departmentController from './department.controller';
import auth from "../../utils/auth";

class departmentRoutes {
    public router:Router;

    departmentController = new departmentController();

    constructor(){
        this.router=Router();
        this.initalizeRoutes();
    }

    initalizeRoutes(){
        //Create Department
        this.router.post('/add',auth,this.departmentController.createDepartment);

        //List Departments
        this.router.get('/',auth,this.departmentController.getDepartments);

        //Update Departments
        this.router.patch('/update/:id',auth,this.departmentController.updateDepartment);

        //Delete Departments
        this.router.delete('/delete/:id',auth,this.departmentController.deleteDepartment);
    }

}

export default new departmentRoutes().router