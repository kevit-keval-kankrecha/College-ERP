import { findFacultyById } from '../Components/Faculty/faculty.DAL';

export default async (req, res, next) => {

    const loginUser = req.loginUser;

    if (!loginUser) {
        res.status(401).send({ "success": false, "error": { "statusCode": 401, "message": "Unauthorized" } })
    }

    //only Admin can manage Department model
    if (req.baseUrl === '/department') {
        if (loginUser.role === 'Admin' && loginUser.role !== 'Faculty' && loginUser.role !== 'Student') {
            next();
        }
        else {
            res.status(403).send({ "success": false, "error": { "statusCode": 403, "message": "You Have Not Permission to access it" } })
        }
    }

    //manage access in User model
    if (req.baseUrl === '/faculty') {

        //Admin can manage all user
        if (loginUser.role === 'Admin') {
            //Faculty Access
            req.accessRoles = ['Faculty'];
            next();
        }

        //faculty can only change their data and view profile for theirself
        else if (loginUser.role === 'Faculty') {
            if ((req.method === 'PATCH' && req.params.id == req.loginUser._id && (req.body.role !== 'Admin'  || req.body.role===undefined)) || (req.method === 'GET' && req.path === '/me')) {
                next();
            }
            else {
                res.status(403).send({ "success": false, "error": { "statusCode": 403, "message": "You Have Not Permission to access it" } })
            }
        }
    }

    if (req.baseUrl === '/student') {
        if (req.loginUser.role === 'Admin' || req.loginUser.role === 'Faculty') {
            next();
        }



    }
}