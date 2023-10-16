
import * as mongoose from 'mongoose';
import Student from '../Student/student.model'
import Department from '../Department/department.model'
import {
    findStudentyById
} from '../Student/student.DAL'


/**
 * 
 * @param studentBody => Department Object to be created.
 */
export async function fillAttendance(attendanceBody) {
    try {
        attendanceBody.map(async (attandance) => {

            const student = await findStudentyById(attandance._id);
            student.attendance.push({ date: attandance.date, present: attandance.present });
            await student.save();
        });
        return true;
    }
    catch (error) {

    }
}

