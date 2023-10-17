import {
    findStudentById
} from '../Student/student.DAL'


/**
 * 
 * @param attendanceBody => List Of Students with attendance date and status
 */
export async function fillAttendance(attendanceBody) {
    try {
        attendanceBody.map(async (attandance) => {
            if (attendanceBody.studentId && attendanceBody.date && attendanceBody.present) {
                const student = await findStudentById(attandance.studentId);
                student.attendance.push({ date: attandance.date, present: attandance.present });
                await student.save();
            }
        });
        return true;
    }
    catch (error) {
        throw new Error(error);
    }
}

