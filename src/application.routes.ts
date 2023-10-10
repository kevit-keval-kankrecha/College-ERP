import {Application} from 'express';
import staffRoutes from './components/staff/staff.routes';

export default class ApplicationConfig {
    public static registerRoute(app:Application){
        app.use('/staff',staffRoutes);
    }
}
