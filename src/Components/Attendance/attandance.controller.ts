import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import {
    fillAttendance,
    getBatchDepartmentWiseData
} from './attandance.DAL'


class studentController {
    async fillAttendance(req, res, next) {
        try {
            const response = fillAttendance(req.body);
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "message": "Attendance Filled Successfully" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while creating new Student" } });
        }
    }

    async getBatchDepartmentWiseData(req, res, next) {
        try {
            getBatchDepartmentWiseData();
        }
        catch (error) {

        }
    }
}
export default studentController;