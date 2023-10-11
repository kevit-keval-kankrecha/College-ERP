
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
                return res.status(200).send({ data: department });
       
        }
        catch (error) {
            res.status(500).send("Invalid  token");
        }
    }

    async getDepartments(req, res, next) {
        try {
            const departments = await findDepartments();
            res.status(200).send({ data: departments });
        }
        catch (error) {
            return next(error);
        }
    }

    async updateDepartment(req, res, next) {
        try {
            const id = req.params.id;
            const department = await findDepartmentById(id);
            if (!department) {
                res.status(404).send({ error: 'Department Not Found' })
            }

            for (const field in req.body) {
                department[field] = req.body[field]
            }
            await department.save();
            res.status(200).send({ data: department });

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
                return next(
                )
            }
            await department.deleteOne();
            res.status(200).send({ data: department });

        }
        catch (error) {
            res.status(500).send({ error: error });
        }
    }
}
export default departmentController;