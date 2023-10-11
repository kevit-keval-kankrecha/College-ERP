import { Router } from "express";
import userController from './user.controller';
import authentication from '../../utils/authentication';
import authorization from '../../utils/authorization';

class userRoutes {
    public router: Router;

    userController = new userController();

    constructor() {
        this.router = Router();
        this.initalizeRoutes();
    }

    initalizeRoutes() {
        //Create New User
        this.router.post('/add', this.userController.createUser);

        //Login User
        this.router.post('/login', this.userController.loginUser);

        //LogOut Users
        this.router.post('/logout', authentication,authorization, this.userController.logOutUser);

        //List User
        this.router.get('/', authentication,authorization, this.userController.getUsers);

        //Update User
        this.router.patch('/update/:id?', authentication, authorization, this.userController.updateUser);

        //Delete User
        this.router.delete('/delete/:id?', authentication, authorization, this.userController.deleteUser);

        //Get Profile
        this.router.get('/me', authentication, authorization, this.userController.getProfile); 
    }

}

export default new userRoutes().router