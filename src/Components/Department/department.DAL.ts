import mongoose, { ObjectId, Schema } from 'mongoose';

import Department from './department.model';

/**
 * Create New Department in DB
 * @param departmentBody => Department Object to be created.
 * @returns => New Created Department
 */
export async function createDepartment(departmentBody: object) {
  try {
    return await Department.create(departmentBody);
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Find All Departments From DB
 * @returns => List Departments
 */
export async function findDepartments() {
  try {
    return await Department.find().sort({ name: 1 });
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Finds Department from DB
 * @param id DepartmentID
 * @returns Department
 */
export async function findDepartmentById(id: string) {
  try {
    return await Department.findById(id);
  } catch (error) {
    throw new Error(error);
  }
}
