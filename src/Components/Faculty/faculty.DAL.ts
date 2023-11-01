import { ObjectId } from 'mongoose';

import Faculty from './faculty.model';

/**
 * Create New Faculty in DB
 * @param FacultyBody => Faculty Object to be created.
 * @returns => New Created Faculty
 */
export async function createFaculty(facultyBody: object) {
  try {
    return await Faculty.create(facultyBody);
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Find Faculty From DB
 * @param emailId => Faculty Email Id
 */
export async function findFacultyByEmailId(emailId: string) {
  try {
    return await Faculty.findOne({ emailId });
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Find All Faculties From DB
 * @returns => List Faculties
 */
export async function findFaculties() {
  try {
    return await Faculty.find();
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Finds Faculty from DB
 * @param id => FacultyID
 * @returns => Faculty
 */
export async function findFacultyById(id: ObjectId) {
  try {
    return await Faculty.findById(id);
  } catch (error) {
  }
}
