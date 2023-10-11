
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
        return await User.findOne({ emailId });
    }
    catch (error) {
    }
}

export async function findUsers(accessRoles) {
    try {
        return await User.aggregate([
            {
                '$match': {
                    'role': {
                        '$in': accessRoles
                    }
                }
            }
        ]).exec();
    }
    catch (error) {
    }
}

/**
 * 
 * @param id UserID
 * @returns User
 */
export async function findUserById(id) {
    try {
        const user=await User.findById(id);
        return user;
    }
    catch (error) {
    }
}