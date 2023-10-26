import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import Department from '../src/Components/Department/department.model';
import Student from '../src/Components/Student/student.model';
import Faculty from '../src/Components/Faculty/faculty.model';
import * as dotenv from 'dotenv';


dotenv.config();

const departmentId = new mongoose.Types.ObjectId();
const adminFacultyId = new mongoose.Types.ObjectId();
const staffFacultyId = new mongoose.Types.ObjectId();
const studentId = new mongoose.Types.ObjectId();

const  departmentOne = {
    name:"Computer Engineering",
    totalSeat:10,
    initial:'CE'
}

const facultyAdmin = {
    _id:adminFacultyId,
    name:"Admin",
    emailId:"admin@gmail.com",
    password:"Admin@123",
    address:"Rajkot",
    departmentId:departmentId,
    role:"Admin",
    authToken:jwt.sign({id:adminFacultyId,emailId: "admin@gmail.com", departmentId: departmentId},process.env.PRIVATE_KEY)
}


const facultyStaff = {
    _id:staffFacultyId,
    name:"Krunal Vyas",
    emailId:"krunal.vyas@gmail.com",
    password:"Krunal@123",
    address:"Gondal",
    departmentId:departmentId,
    role:"Faculty",
    authToken:jwt.sign({id:staffFacultyId,emailId: "krunal.vyas@gmail.com", departmentId: departmentId},process.env.PRIVATE_KEY)
}

const demoFacultyToCreate = {
    name:"Demo",
    emailId:"keval@gmail.com",
    password:"Keval@123",
    address:"Rajkot",
    departmentId:departmentId,
    role:"Faculty",
    authToken:jwt.sign({id:staffFacultyId,emailId: "keval@gmail.com", departmentId: departmentId},process.env.PRIVATE_KEY)
}

const demoStudentToCreate={
    name:"Keval Student",
    emailId:"keval@gmail.com",
    password:"Keval@2023",
    address:"Gondal",
    departmentId:departmentId,
    semester:1,
    batchYear:2023,
    onRoll:true,
    attendance:[],
    authToken:jwt.sign({id:studentId,emailId: "keval@gmail.com", departmentId: departmentId},process.env.PRIVATE_KEY)
}

const studentLogin={
    _id:studentId,
    name:"Keval for login",
    emailId:"kevallogin@gmail.com",
    password:"Kevallogin@2023",
    address:"Gondal",
    departmentId:departmentId,
    authToken:jwt.sign({id:studentId,emailId: "kevallogin@gmail.com", departmentId: departmentId},process.env.PRIVATE_KEY),
    semester:1,
    batchYear:2023,
    onRoll:true,
    attendance:[]
}

const setupDataBase=async ()=>{
    await Student.deleteMany();
    await Faculty.deleteMany();
    await Department.deleteMany();
    await new Department(departmentOne).save();
    await new Faculty(facultyAdmin).save();
    await new Faculty(facultyStaff).save();
    await new Faculty(demoFacultyToCreate).save();
    await new Student(demoStudentToCreate).save();
    await new Student(studentLogin).save();
}

export default {
    setupDataBase,
    departmentOne,
    facultyAdmin,
    facultyStaff,
    adminFacultyId,
    staffFacultyId,
    demoFacultyToCreate,
    demoStudentToCreate,
    studentLogin
}
