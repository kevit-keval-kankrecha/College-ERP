import { findStudentById } from '../Student/student.DAL';

/**
 *
 * @param attendanceBody => List Of Students with attendance date and status
 */
export async function fillAttendance(attendanceBody) {
  try {
    attendanceBody.map(async (attendance) => {
      if (attendanceBody.studentId && attendanceBody.date && attendanceBody.present) {
        const student = await findStudentById(attendance.studentId);
        student.attendance.push({ date: attendance.date, present: attendance.present });
        await student.save();
      }
    });
    return true;
  } catch (error) {
    throw new Error(error);
  }
}
