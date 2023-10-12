import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import {
    createFaculty,
    findFacultyByEmailId,
    findFacultyById,
    findFaculties
} from './faculty.DAL'


class facultyController {
    async createFaculty(req, res, next) {
        try {
            const facultyObj = req.body;
            const faculty = await createFaculty(facultyObj);
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": faculty, "message": "New Faculty Created Successfully" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while creating new user" } });
        }
    }

    async loginFaculty(req, res, next) {
        try {
            const { emailId, password } = req.body;
            if (!emailId || !password) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "Please Provide an emailId and password" } });
            }


            const faculty = await findFacultyByEmailId(emailId);

            if (faculty) {
                const match = await bcrypt.compare(password, faculty.password);

                if (match) {
                    const privateSecret = "12abnjbnjh3gdhr45678451@@##!@#!";

                    const token = jwt.sign({ id: faculty._id, emailId: faculty.emailId, departmentId: faculty.departmentId }, privateSecret);
                    faculty.authToken = token;
                    await faculty.save();
                    res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": faculty.authToken, "message": "Authentication Token Generated" } });
                }
                else {
                    res.status(401).send({ "success": false, "error": { "statusCode": 401, "message": "Invalid EmailId or Password" } });
                }
            }
            else {
                res.status(401).send({ "success": false, "error": { "statusCode": 401, "message": "Invalid EmailId or Password" } });
            }
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while Login" } });
        }
    }

    async logOutFaculty(req, res, next) {
        try {
            const id = req.loginUser.id;
            const faculty = await findFacultyById(id);
            if (!faculty) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "faculty not found" } });
            }
            faculty.authToken = ' ';
            await faculty.save();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": faculty, "message": "faculty Logout Successfully" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while Login" } });
        }
    }

    async getFaculties(req, res, next) {
        try {
            const faculties = await findFaculties(req.accessRoles);
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": faculties, "message": "Success" } });

        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while Loading Users" } });
        }
    }

    async updateFaculty(req, res, next) {
        try {
            let id = req.params.id;

            const faculty = await findFacultyById(id);
            if (!faculty) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "faculty not found" } });
            }

            for (const field in req.body) {
                faculty[field] = req.body[field]
            }
            await faculty.save();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": faculty, "message": "faculty Updated Sucessfully" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while updating faculty" } });
        }
    }

    async deleteFaculty(req, res, next) {
        try {
            const id = req.params.id;
            const faculty = await findFacultyById(id);
            if (!faculty) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "faculty not found" } });
            }
            await faculty.deleteOne();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": faculty, "message": "faculty Deleted Sucessfully" } });

        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while deleting faculty" } });
        }
    }

    async getProfile(req, res, next) {
        try {
            const faculty = await findFacultyById(req.loginUser._id);
            if (!faculty) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "faculty not found" } });
            }
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": faculty, "message": "Profile" } });
        }
        catch {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while Loading your profile" } });
        }
    }
}
export default facultyController;