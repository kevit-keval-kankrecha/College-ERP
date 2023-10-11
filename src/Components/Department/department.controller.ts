
import {
    createDepartment,
    findDepartments,
    findDepartmentById
}
    from
    './department.DAL';

class departmentController {
    async createDepartment(req, res, next) {
        try {
            const departmentObj = req.body;
            const department = await createDepartment(departmentObj);
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": department, "message": "New Department Created Successfully" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while creating new Department" } });
        }
    }

    async getDepartments(req, res, next) {
        try {
            const departments = await findDepartments();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": departments, "message":"Success" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while Loading Departments" } });
        }
    }

    async updateDepartment(req, res, next) {
        try {
            const id = req.params.id;
            const department = await findDepartmentById(id);
            if (!department) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "Department not found" } });
            }

            for (const field in req.body) {
                department[field] = req.body[field]
            }
            await department.save();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": department, "message":"Department Updated Sucessfully" } });

        }
        catch (error) {
            res.status(500).send({ error: error });
        }
    }

    async deleteDepartment(req, res, next) {
        try {
            const id = req.params.id;
            const department = await findDepartmentById(id);
            if (!department) {
                res.status(404).send({ "success": false, "error": { "statusCode": 404, "message": "Department not found" } });
            }
            await department.deleteOne();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": department, "message":"Department Deleted Sucessfully" } });

        }
        catch (error) {
            res.status(500).send({ "success": false, "error": { "statusCode": 500, "message": "Error while deleting Users" } });
        }
    }
}
export default departmentController;