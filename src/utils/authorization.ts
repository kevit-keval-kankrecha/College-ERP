import { findUserById } from '../Components/User/user.DAL';

export default async (req, res, next) => {

    const user = await findUserById(req.user._id);
    //if user not found
    if (!user) {
        res.status(401).send({ "success": false, "error": { "statusCode": 401, "message": "Unauthorized" } })
    }

    //only Admin can manage Department model
    if (req.baseUrl === '/department') {
        if (user.role === 'Admin') {
            req.accessRoles = ['Faculty', 'Student']
            next();
        }
        else {
            res.status(403).send({ "success": false, "error": { "statusCode": 403, "message": "You Have Not Permission to access it" } })
        }
    }

    //manage access in User model
    if (req.baseUrl === '/user') {

        //Admin can manage all user
        if (user.role === 'Admin') {
            
            next();
        }

        //faculty can only manage students
        else if (user.role === 'Faculty') {
            const accessRole: String[] = ['Student']
            req.accessRole = accessRole

            //when faculty try to update or delete it will check if student or not
            if (req.params.id && req.params.id!==req.user._id) {
                const user = await findUserById(req.params.id);
                if (accessRole.includes(user.role)) {
                    next();
                }
                else {
                    res.status(403).send({ "success": false, "error": { "statusCode": 403, "message": "You Have Not Permission to access it" } })
                }
            }

            //manage their self
            else {
                req.params.id = req.user._id;
                next();
            }
        }

        //student can manage it self only
        if (user.role === 'Student') {
            if (req.params.id === undefined) {
                req.params.id = req.user._id;
                next();
            }
            else{
                if(req.params.id===req.user._id){
                    next();
                }
                else{
                    res.status(403).send({ "success": false, "error": { "statusCode": 403, "message": "You Have Not Permission to access it" } })
                }
            }
        }

    }
}