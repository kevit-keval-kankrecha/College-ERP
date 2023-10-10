import mongoose from "mongoose";
import * as bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

// User Schema For DataBase
const userSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    emailId: {
        type: Schema.Types.String,
        required: true
    },
    password:{
        type:Schema.Types.String,
        require:true
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
        required: true
    },
    role: {
        type: Schema.Types.String,
        required: true
    }
}, {
    timestamps: true
});

//encrypt password
userSchema.pre('save',async function (next){
    try{
        if(this.isModified('password')){
            this.password=await bcrypt.hash(this.password,8);
        }
        next();
    }
    catch(error){
        
    }
});


const User = model('User', userSchema);
export default User;