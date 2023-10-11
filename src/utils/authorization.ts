import { findUserById } from '../Components/User/user.DAL';

export default async (req, res, next) => {
    //Admin can manage all Users
    if (req.user.role === 'Admin') {
        req.accessRoles = ['Faculty', 'Student']
        next();
    }
    else if (req.user.role === 'Faculty') {
        //Faculty can manage theirself and Students
        const accessRole: String[] = ['Student']
        req.accessRole = accessRole
        //update and delete by id?
        if (req.params.id) {
            const user = await findUserById(req.params.id);
            if (accessRole.includes(user.role)) {
                next();
            }
            else {
                res.status(403).send({ error: "Forbidden" });
            } next();

        }
        //update/delete theirself only
        else {
            next();
        }
    }
    else if (req.user.role === 'Student') {
        if (req.params.id!==undefined) {
            if (req.user._id === req.params.id) {
                next();
            }
            else {
                res.status(403).send({ error: "Forbidden" });
            }
        }
        else{
            //Student will alway update/delete their self only
            next();
        }
    }
    else {
        res.status(401).send({ error: "Unauthorized access" });
    }
}