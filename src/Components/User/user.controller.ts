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
            res.status(200).send({ data: user });
        }
        catch (error) {
            return next(error);
        }
    }

    async loginUser(req, res, next) {
        try {
            const { emailId, password } = req.body;
            if (!emailId || !password) {
                res.status(404).send("Please Provide EmailId and Password");
            }
            const user = await findUserByEmailId(emailId);

            if (user) {
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    const privateSecret = "12abnjbnjh3gdhr45678451@@##!@#!";

                    const token = jwt.sign({ id: user._id, emailId: user.emailId, departmentId: user.departmentId }, privateSecret);
                    user.authToken = token;
                    await user.save();
                    res.status(200).send({ token: user.authToken });
                }
                else {
                    res.status(401).send({ error: "Invalid EmailId or Password" });
                }
            }
            else {
                res.status(401).send({ error: "Invalid EmailId or Password" });
            }
        }
        catch (error) {
            return next(error);
        }
    }

    async logOutUser(req, res, next) {
        try {
            const id = req.user.id;
            const user = await findUserById(id);
            if (!user) {
                res.status(401).send("Unauthenticated");
            }
            user.authToken = ' ';
            await user.save();
            res.status(200).send({ data: user });
        }
        catch (error) {
            res.status(500).send({ error: error });
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await findUsers(req.accessRoles);
            res.status(200).send({ data: users });
        }
        catch (error) {
            return next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            let id=req.params.id;
            if(!req.params.id){
                id=req.user._id;
            }
            const user = await findUserById(id);
            if (!user) {
                res.status(404).send({ error: 'user Not Found' })
            }

            for (const field in req.body) {
                user[field] = req.body[field]
            }
            await user.save();
            res.status(200).send({ data: user });
        }
        catch (error) {
            res.status(500).send({ error: error });
        }
    }

    async deleteUser(req, res, next) {
        try {
            const id = req.params.id;
            const user = await findUserById(id);
            if (!user) {
                res.status(404).send("User Not Found");
            }
            await user.deleteOne();
            res.status(200).send({ data: user });

        }
        catch (error) {
            res.status(500).send({ error: error });
        }
    }

    async getProfile(req,res,next){
        try{
            const user=await findUserById(req.user._id);
            if(!user){
                res.status(404).send("User not Found");
            }
            res.status(200).send({data:user});
        }
        catch{
            res.status(500).send("Internal Server");
        }
    }
}
export default userController;