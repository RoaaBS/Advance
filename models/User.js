const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require("jsonwebtoken");
const path = require('path');

//user schema
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:100,
        unique:true,
    },
    username:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        maxlength:100,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
    },
    location:{
        type:String,
        trim:true,
        minlength:6,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    photo:{
        type:String,
        default:"images/2024-03-30T14:50:27.383ZScreenshot from 2024-03-28 00-54-16.png", // Set a default photo filename
    }
},{timestamps:true});

//Generate Token
UserSchema.methods.generateToken = function(){
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET_KEY);
}

//userModel
const User = mongoose.model("User", UserSchema);

function validateUser(obj) {
    const schema = Joi.object({
        email: Joi.string().required().trim().min(5).max(100),
        username: Joi.string().required().trim().min(2).max(100),
        password: Joi.string().required().trim().min(6),
        location: Joi.string().trim().min(6),
        isAdmin: Joi.boolean().default(false),
        photo: Joi.string() // Adjust validation to include photo
    });

    return schema.validate(obj);
}

//Validate Register User
function validateRegisterUser(obj){
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        username: Joi.string().trim().min(2).max(100).required(),
        password: Joi.string().trim().min(6).required(),
        location: Joi.string().trim().min(6),
        photo: Joi.string() // Adjust validation to include photo
    });

    return schema.validate(obj);
}

//validate login user
function validateLoginUser(obj){
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(6).required(),
    });

    return schema.validate(obj);
}

//validate update user 
function validateUpdateUser(obj){
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        username: Joi.string().trim().min(2).max(100),
        password: Joi.string().trim().min(6),
        location: Joi.string().trim().min(6),
        photo: Joi.string() // Adjust validation to include photo
    });

    return schema.validate(obj);
}

module.exports = {
    User,
    validateUser,
    validateUpdateUser,
    validateLoginUser,
    validateRegisterUser
}
