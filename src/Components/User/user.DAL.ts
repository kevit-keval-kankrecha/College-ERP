
import User from './user.model'


/**
 * 
 * @param userBody => Department Object to be created.
 */
export async function createUser(userBody) {
    try {
        return await User.create(userBody);
    }
    catch (error) {

    }
}

/**
 * 
 * @param userBody => Department Object to be created.
 */
export async function findUserByEmailId(emailId) {
    try {
        return await User.findOne({emailId});
    }
    catch (error) {
    }
}

export async function findUsers() {
    try {
        return await User.find().sort({ name: 1 });
    }
    catch (error) {
    }
}

/**
 * 
 * @param id DepartmentID
 * @returns Department
 */
export async function findUserById(id) {
    try {
        return await User.findById(id);
    }
    catch(error) {
    }
}