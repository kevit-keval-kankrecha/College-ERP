import { Router } from "express";
import userController from './user.controller';
import auth from '../../utils/auth';

class userRoutes {
    public router:Router;

    userController = new userController();

    constructor(){
        this.router=Router();
        this.initalizeRoutes();
    }

    initalizeRoutes(){
        //Create New User
        this.router.post('/add',this.userController.createUser);    

         //Login User
         this.router.post('/login',this.userController.loginUser); 

        //LogOut Users
        this.router.post('/logout',auth,this.userController.logOutUser); 

        //List User
        this.router.get('/',auth,this.userController.getUsers);

         //Update User
         this.router.patch('/update/:id?',auth,this.userController.updateUser);

         //Delete Departments
         this.router.delete('/delete/:id',auth,this.userController.deleteUser);
    }

}

export default new userRoutes().router