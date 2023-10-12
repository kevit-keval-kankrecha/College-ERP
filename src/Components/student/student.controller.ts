import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import {
    createStudent,
    findStudentByEmailId,
    findStudentyById,
    findFaculties
} from './student.DAL'


class facultyController {
    async createStudent(req, res, next) {
        try {
            const studentObj = req.body;
            const student = await createStudent(studentObj);
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": student, "message": "New Student Created Successfully" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while creating new Student" } });
        }
    }

    async loginStudent(req, res, next) {
        try {
            const { emailId, password } = req.body;
            if (!emailId || !password) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "Please Provide an emailId and password" } });
            }
            const student = await findStudentByEmailId(emailId);
            if (student) {
                const match = await bcrypt.compare(password, student.password);

                if (match) {
                    const privateSecret = "12abnjbnjh3gdhr45678451@@##!@#!";

                    const token = jwt.sign({ id: student._id, emailId: student.emailId, departmentId: student.departmentId }, privateSecret);
                    student.authToken = token;
                    await student.save();
                    res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": student.authToken, "message": "Authentication Token Generated" } });
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

    async logOutStudent(req, res, next) {
        try {
            const id = req.loginUser.id;
            const student = await findStudentyById(id);
            if (!student) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "student not found" } });
            }
            student.authToken = ' ';
            await student.save();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": student, "message": "student Logout Successfully" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while LogOut" } });
        }
    }

    async getStudents(req, res, next) {
        try {
            const students = await findFaculties(req.accessRoles);
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": students, "message": "Success" } });

        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while Loading Users" } });
        }
    }

    async updateFaculty(req, res, next) {
        try {
            let id = req.params.id;

            const faculty = await findStudentyById(id);
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
            const faculty = await findStudentyById(id);
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
            const student = await findStudentyById(req.loginUser._id);
            if (!student) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "Student  not found" } });
            }
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": student, "message": "Profile" } });
        }
        catch {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while Loading your profile" } });
        }
    }
}
export default facultyController;