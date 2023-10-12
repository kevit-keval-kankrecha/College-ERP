import { findFacultyById } from '../Components/Faculty/faculty.DAL';

export default async (req, res, next) => {

    const faculty = await findFacultyById(req.faculty._id);
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
            //Faculty Access
            req.accessRoles = ['Faculty'];

            next();

        }

        //faculty can only manage students
        else if (faculty.role === 'Faculty') {
            //faculty can update and delete theirself but can not change role
            console.log(req.body.role);
            if (JSON.stringify(req.faculty._id) === JSON.stringify(req.params.id) && req.body.role!=='Admin') {
                next();
            }

            //faculty can not create new faculty
            else if (req.body.role === 'Admin' && req.body.role === 'Faculty') {
                res.status(403).send({ "success": false, "error": { "statusCode": 403, "message": "You Have Not Permission to access it" } })
            }

            else {
                res.status(403).send({ "success": false, "error": { "statusCode": 403, "message": "You Have Not Permission to access it" } })
            }
        }
    }
}