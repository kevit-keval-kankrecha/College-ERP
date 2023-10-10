
import Department from './department.model'


/**
 * 
 * @param departmentBody => Department Object to be created.
 */
export async function createDepartment(departmentBody) {
    try {
        return await Department.create(departmentBody);
    }
    catch (error) {
    }
}

export async function findDepartments() {
    try {
        return await Department.find().sort({ name: 1 });
    }
    catch (error) {
    }
}

/**
 * 
 * @param id DepartmentID
 * @returns Department
 */
export async function findDepartmentById(id) {
    try {
        return await Department.findById(id);
    }
    catch(error) {
    }
}