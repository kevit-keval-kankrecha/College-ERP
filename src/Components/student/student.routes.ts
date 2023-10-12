import { Router } from "express";
import studentController from './student.controller';
import authentication from '../../utils/authentication';
import authorization from '../../utils/authorization';

class studentRoutes {
    public router: Router;

    studentController = new studentController();

    constructor() {
        this.router = Router();
        this.initalizeRoutes();
    }

    initalizeRoutes() {
        //Create New User
        this.router.post('/add',authentication,authorization, this.studentController.createStudent);

        //Login User
        this.router.post('/login', this.studentController.loginStudent);

        //LogOut Users
        this.router.post('/logout', authentication,authorization, this.studentController.logOutStudent);

        //List User
        this.router.get('/', authentication, this.studentController.getStudents);

        //Update User
        this.router.patch('/update/:id?', authentication,authorization, this.studentController.updateFaculty);

        //Delete User
        this.router.delete('/delete/:id?', authentication,authorization, this.studentController.deleteFaculty);

        //Get Profile
        this.router.get('/me', authentication,authorization, this.studentController.getProfile); 
    }

}

export default new studentRoutes().router