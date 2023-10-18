import { Router } from "express";

import facultyController from './faculty.controller';
import authentication from '../../utils/authentication';
import authorization from '../../utils/authorization';

class facultyRoutes {
    public router: Router;

    facultyController = new facultyController();

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        //Create New User
        this.router.post('/add', this.facultyController.createFaculty);

        //Login User
        this.router.post('/login', this.facultyController.loginFaculty);

        //LogOut Users
        this.router.post('/logout', authentication,authorization, this.facultyController.logOutFaculty);

        //List User
        this.router.get('/', authentication, authorization,this.facultyController.getFaculties);

        //Update User
        this.router.patch('/update/:id?', authentication,authorization, this.facultyController.updateFaculty);

        //Delete User
        this.router.delete('/delete/:id?', authentication,authorization, this.facultyController.deleteFaculty);

        //Get Profile
        this.router.get('/me', authentication,authorization, this.facultyController.getProfile); 
    }
}

export default new facultyRoutes().router