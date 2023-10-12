import { findFacultyById } from '../Components/Faculty/faculty.DAL';

export default async (req, res, next) => {
    console.log(req.user);
    const faculty = await findFacultyById(req.user._id);
    //if faculty not found
    if (!faculty) {
        res.status(401).send({ "success": false, "error": { "statusCode": 401, "message": "Unauthorized" } })
    }

    //only Admin can manage Department model
    if (req.baseUrl === '/department') {
        if (faculty.role === 'Admin') {
            next();
        }
        else {
            res.status(403).send({ "success": false, "error": { "statusCode": 403, "message": "You Have Not Permission to access it" } })
        }
    }

    //manage access in User model
    if (req.baseUrl === '/faculty') {

        //Admin can manage all user
        if (faculty.role === 'Admin') {
            next();
            //Faculty Access
            req.accessRoles = ['Faculty'];
        }

        //faculty can only manage students
        else if (faculty.role === 'Faculty') {
            //faculty can update and delete theirself
            if (req.user._id === req.params.id) {
                next();
            }

            //faculty can not create new faculty
            if (req.body.role === 'Admin' && req.body.role === 'Faculty') {
                res.status(403).send({ "success": false, "error": { "statusCode": 403, "message": "You Have Not Permission to access it" } })
            }


        }
    }
}