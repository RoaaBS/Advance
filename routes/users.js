const express = require ("express");
const router= express.Router();
const asyncHandler =require("express-async-handler");
const bcrypt =require("bcryptjs");
const { User, validateUpdateUser,validateUser } = require("../models/User");

const{ verifyTokenandAuthorization,verifyTokenandAdmin} =require("../middleware/verifyToken");
const nodemailer = require('nodemailer');


const Weather = require('../models/weather'); // Assuming you have a Weather model




/**
 * create new user
 * @route POST /api/users
 * @access private 
 */
router.post("/", asyncHandler(async(req, res) => {
    const { error } = validateUser(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        location: req.body.location,
        isAdmin: req.body.isAdmin
    });

   try {
        const result = await newUser.save();

        const weatherData = await Weather.findOne({ city: newUser.location });

    if (!weatherData) {
      return res.status(404).json({ error: 'Weather data not found for the city' });
    }

        // Send email to the user
       const transporter = nodemailer.createTransport({
           service: 'gmail',
    auth: {
       user: 's11941236@stu.najah.edu',
       pass: ''
    },
       
        });

        const mailOptions = {
           from: 's11941236@stu.najah.edu',
           to: newUser.email,
            subject: 'Welcome to our platform!',
            text: `Hello ${newUser.username},\n\nWelcome to our platform! Your account has been successfully created.\n Weather in ${newUser.location}: ${weatherData}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
               console.error('Error sending email:', error);
           } else {
                console.log('Email sent:', info.response);
            }
       });
    

        res.status(201).json(result);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));





//////////////////////////////////////////////////////////////////////////



/**
 * @desc   update  user
 * @route /api/auth/:id
 * @method post
 * @access private
 */
router.put("/:id",verifyTokenandAuthorization,asyncHandler(async(req,res)=>{
   
    const { error }= validateUpdateUser(req.body);


    if(error){
      return res.status(400).json({ message:error.details[0].message});
    }



    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password =await bcrypt.hash(req.body.password,salt);
    }
    const updateduser = await User.findByIdAndUpdate(req.params.id,{
        $set: {
            email:req.body.email,
            password:req.body.password,
            username:req.body.username
        }
    
       },{new:true}).select("-password");
       res.status(200).json(updateduser);
       
 
}));




/**
 * @desc  Get all users 
 * @route /api/users
 * @method Get
 * @access private (only admin can get all users)
 */
router.get("/",verifyTokenandAdmin,asyncHandler(async(req,res)=>{
   
   const users =await User.find().select("-password");

       res.status(200).json(users);
       
 
}));


/**
 * @desc  Get  users by id  
 * @route /api/users/"id"
 * @method Get
 * @access private (only admin can get all users and users himself)
 */
router.get("/:id", verifyTokenandAuthorization, asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
}));


/**
 * @desc  Delete
 * @route /api/users/"id"
 * @method Delete
 * @access private (only admin can get all users and users himself)
 */
router.delete("/:id", verifyTokenandAuthorization, asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User has been deleted" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
}));
















module.exports =router;