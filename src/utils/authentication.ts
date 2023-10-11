import { findUserById } from '../Components/User/user.DAL';
import * as jwt from 'jsonwebtoken';

export default async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        const privateSecret = "12abnjbnjh3gdhr45678451@@##!@#!";

        const { id } = jwt.verify(token, privateSecret);

        const user = await findUserById(id);

        if(!user){
            res.status(401).send({ error: "Unauthorized" });
        }

        if (token === user.authToken) {
            req.user = user;
            next();
        }
        else {
            res.status(401).send({ error: "Unauthorized" });
        }
    }
    catch {
        res.status(401).send({ error: "Unauthorized" });
    }
}