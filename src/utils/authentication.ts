import { findFacultyById } from '../Components/Faculty/faculty.DAL';
import * as jwt from 'jsonwebtoken';

export default async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        const privateSecret = "12abnjbnjh3gdhr45678451@@##!@#!";

        const { id } = jwt.verify(token, privateSecret);

        const faculty = await findFacultyById(id);
        if (!faculty) {
            res.status(400).send({ "success": false, "error": { "statusCode": 401, "message": "faculty not Found" } });
        }

        if (token === faculty.authToken) {
            req.faculty = faculty;
            next();
        }
        else {
            res.status(401).send({ "success": false, "error": { "statusCode": 401, "message": "Unauthorized Faculty" } });
        }
    }
    catch (error) {
        res.status(401).send({ "success": false, "error": { "statusCode": 401, "message": "Unauthorized Faculty" } });
    }
}