import * as mongoose from 'mongoose';

import Student from './student.model';

/**
 * Create Student in DB
 * @param studentBody => Student Object to be created.
 * @returns => New Created Student
 */
export async function createStudent(studentBody) {
  try {
    return await Student.create(studentBody);
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Find Student from DB
 * @param emailId => Student Email
 * @returns => Student
 *
 */
export async function findStudentByEmailId(emailId) {
  try {
    return await Student.findOne({ emailId });
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Find Students From DB
 * @returns => List of Students
 */
export async function findStudents() {
  try {
    return await Student.find().lean();
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Find Student
 * @param id => Student Id
 * @returns => Student
 */
export async function findStudentById(id: mongoose.ObjectId) {
  try {
    return await Student.findById(id);
  } catch (error) {
    throw new Error(error);
  }
}
