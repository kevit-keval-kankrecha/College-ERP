import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import {
    createUser,
    findUserByEmailId,
    findUserById,
    findUsers
} from './user.DAL'


class userController {
    async createUser(req, res, next) {
        try {
            const userObj = req.body;
            const user = await createUser(userObj);
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": user, "message":"New User Created Successfully" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while creating new user" } });
        }
    }

    async loginUser(req, res, next) {
        try {
            const { emailId, password } = req.body;
            if (!emailId || !password) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "Please Provide an emailId and password" } });
            }
            const user = await findUserByEmailId(emailId);

            if (user) {
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    const privateSecret = "12abnjbnjh3gdhr45678451@@##!@#!";

                    const token = jwt.sign({ id: user._id, emailId: user.emailId, departmentId: user.departmentId }, privateSecret);
                    user.authToken = token;
                    await user.save();
                    res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": user.authToken, "message":"Authentication Token Generated" } });
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

    async logOutUser(req, res, next) {
        try {
            const id = req.user.id;
            const user = await findUserById(id);
            if (!user) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "User not found" } });
            }
            user.authToken = ' ';
            await user.save();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": user, "message":"User Logout Successfully" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while Login" } });
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await findUsers(req.accessRoles);
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": users, "message":"Success" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while Loading Users" } });
        }
    }

    async updateUser(req, res, next) {
        try {
            let id = req.params.id;
            
            const user = await findUserById(id);
            if (!user) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "User not found" } });
            }

            for (const field in req.body) {
                user[field] = req.body[field]
            }
            await user.save();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": user, "message":"User Updated Sucessfully" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while updating Users" } });
        }
    }

    async deleteUser(req, res, next) {
        try {
            const id = req.params.id;
            const user = await findUserById(id);
            if (!user) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "User not found" } });
            }
            await user.deleteOne();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": user, "message":"User Deleted Sucessfully" } });

        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while deleting Users" } });
        }
    }

    async getProfile(req, res, next) {
        try {
            const user = await findUserById(req.user._id);
            if (!user) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "User not found" } });
            }
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": user, "message":"Profile" } });
        }
        catch {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while Loading your profile" } });
        }
    }
}
export default userController;