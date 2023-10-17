import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import {
    createStudent,
    findStudentByEmailId,
    findStudentyById,
    findStudents,
    getAbsentStudentBatchYearSemesterDateWise,
    getBatchDepartmentWiseData,
    getMoreThen75PercentStudent
} from './student.DAL'



class studentController {
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
            const students = await findStudents();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": students, "message": "Success" } });

        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while Loading Users" } });
        }
    }

    async updateStudent(req, res, next) {
        try {
            let id = req.params.id;

            const student = await findStudentyById(id);
            if (!student) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "student not found" } });
            }

            for (const field in req.body) {
                student[field] = req.body[field]
            }
            await student.save();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": student, "message": "student Updated Sucessfully" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while updating student" } });
        }
    }

    async deleteStudent(req, res, next) {
        try {
            const id = req.params.id;
            const student = await findStudentyById(id);

            if (!student) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "student not found" } });
            }
            await student.deleteOne();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": student, "message": "student Deleted Sucessfully" } });

        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while deleting student" } });
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

    //Analysis
    async getBatchDepartmentWiseData(req, res, next) {
        try {
            const data = await getBatchDepartmentWiseData();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": data, "message": "Success" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "data": { "statusCode": 500, "message": "Something went wrong white retriving data" } });
        }
    }


    async getAbsentStudentBatchYearSemesterDateWise(req, res, next) {
        try {
            const data = await getAbsentStudentBatchYearSemesterDateWise(req.body);
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": data, "message": "Success" } });
        }
        catch {
            res.status(500).send({ "success": false, "data": { "statusCode": 500, "message": "Something went wrong white retriving data" } });
        }
    }

    async getMoreThen75PercentStudent(req, res, next) {
        try {
            const data = await getMoreThen75PercentStudent(req.body);
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": data, "message": "Success" } });
        }
        catch {
            res.status(500).send({ "success": false, "data": { "statusCode": 500, "message": "Something went wrong white retriving data" } });
        }
    }
}
export default studentController;