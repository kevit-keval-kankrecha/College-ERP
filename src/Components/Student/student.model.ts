import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as validator from 'validator';

const { Schema, model } = mongoose;

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

// Student Schema For DataBase
const studentSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    emailId: {
      type: Schema.Types.String,
      required: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error('Enter Valid Email Address');
        }
      },
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    address: {
      type: Schema.Types.String,
      required: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Department',
    },
    authToken: {
      type: Schema.Types.String,
      required: true,
      default: ' ',
    },
    semester: {
      type: Schema.Types.Number,
      required: true,
      default: 1,
    },
    batchYear: {
      type: Schema.Types.Number,
      required: true,
    },
    onRoll: {
      type: Schema.Types.Boolean,
      required: true,
      default: true,
    },
    attendance: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export interface IStudent {
  name: String;
  emailId: String;
  password: String;
  address: String;
  departmentId: String;
  semester: Number;
  batchYear: Number;
  onRoll: boolean;
}

//encrypt password
studentSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    next();
  } catch (error) {}
});

const Student = model('Student', studentSchema);
export default Student;
