const express = require ("express");
const router= express.Router();
const asyncHandler =require("express-async-handler");
const bcrypt =require("bcryptjs");
const { User, validateUpdateUser } = require("../models/User");

const{ verifyTokenandAuthorization,verifyTokenandAdmin} =require("../middleware/verifyToken");



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