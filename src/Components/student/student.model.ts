import mongoose from "mongoose";
import * as bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

// Faculty Schema For DataBase
const studentSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    emailId: {
        type: Schema.Types.String,
        required: true
    },
    password: {
        type: Schema.Types.String,
        require: true
    },
    address: {
        type: Schema.Types.String,
        required: true
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Department'
    },
    authToken: {
        type: Schema.Types.String,
        required: true,
        default: ' '
    },
    semester: {
        type: Schema.Types.Number,
        requied: true,
        default: 1
    },
    batchYear: {
        type: Schema.Types.Number,
        required: true
    },
    onRoll: {
        type: Schema.Types.Boolean,
        require: true,
        default: true
    }
}, {
    timestamps: true
});

//encrypt password
studentSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 8);
        }
        next();
    }
    catch (error) {

    }
});


const Student = model('Student', studentSchema);
export default Student;