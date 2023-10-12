import {Application} from 'express';
import departmentRoutes from './Components/Department/department.routes';
import facultyRoutes from './Components/Faculty/faculty.routes';
import IndexRoute from './index';

export default class ApplicationConfig {
    public static registerRoute(app:Application){
        app.use('/', IndexRoute);
        app.use('/department',departmentRoutes);
        app.use('/faculty',facultyRoutes);
    }
}
