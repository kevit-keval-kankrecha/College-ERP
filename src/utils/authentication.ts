import { findFacultyById } from '../Components/Faculty/faculty.DAL';
import { findStudentyById } from '../Components/student/student.DAL';
import * as jwt from 'jsonwebtoken';

export default async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        const privateSecret = "12abnjbnjh3gdhr45678451@@##!@#!";

        //get id of user by token
        const { id } = jwt.verify(token, privateSecret);


        //get user by id
        let loginUser;

        if (req.baseUrl === '/student') {
            loginUser = await findStudentyById(id);
        }
        else {
            loginUser = await findFacultyById(id);
        }

        if (!loginUser) {
            res.status(400).send({ "success": false, "error": { "statusCode": 401, "message": "User not Found" } });
        }

        //checking for valid token
        if (token === loginUser.authToken) {
            req.loginUser = loginUser
            next();
        }
        else {
            res.status(401).send({ "success": false, "error": { "statusCode": 401, "message": "Unauthorized User" } });
        }
    }
    catch (error) {
        res.status(401).send({ "success": false, "error": { "statusCode": 401, "message": "Unauthorized User" } });
    }
}