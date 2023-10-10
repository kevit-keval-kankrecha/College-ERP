import {Application} from 'express';
import departmentRoutes from './Components/Department/department.routes';
import userRoutes from './Components/User/user.routes';
import IndexRoute from './index';

export default class ApplicationConfig {
    public static registerRoute(app:Application){
        app.use('/', IndexRoute);
        app.use('/department',departmentRoutes);
        app.use('/user',userRoutes);
    }
}
