import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

// Faculty Schema For DataBase
const facultySchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    emailId: {
      type: Schema.Types.String,
      required: true,
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
    role: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export interface sampleFaculty{
  name:String,
  emailId:String,
  password:String,
  address:String,
  department:String,
  role:String
}

//encrypt password
facultySchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    next();
  } catch (error) {}
});

const Faculty = model('Faculty', facultySchema);
export default Faculty;
