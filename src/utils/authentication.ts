import * as dotenv from 'dotenv';

import { findFacultyById } from '../Components/Faculty/faculty.DAL';
import { findStudentById } from '../Components/Student/student.DAL';
import * as jwt from 'jsonwebtoken';

export default async (req, res, next) => {
  try {
    dotenv.config();
    const token = req.header('Authorization').replace('Bearer ', '');

    const privateKey = process.env.PRIVATE_KEY;

    //get id of user by token
    const { id } = jwt.verify(token, privateKey);

    //get user by id
    const loginUser = (await findFacultyById(id)) === null ? await findStudentById(id) : await findFacultyById(id);

    if (!loginUser) {
      res.status(400).send({ success: false, error: { statusCode: 401, message: 'User not Found' } });
    }

    //checking for valid token
    if (token === loginUser.authToken) {
      req.loginUser = loginUser;

      next();
    } else {
      res.status(401).send({ success: false, error: { statusCode: 401, message: 'Unauthorized User' } });
    }
  } catch (error) {
    res.status(401).send({ success: false, error: { statusCode: 401, message: 'Unauthorized User' } });
  }
};
