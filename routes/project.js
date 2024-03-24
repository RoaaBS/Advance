const express = require("express");
const router= express.Router();
const asyncHandler =require("express-async-handler");
const bcrypt =require("bcryptjs");
const {verifyTokenandAdmin}=require("../middleware/verifyToken");
const { project, validateCreateProject, validateUpdateProject } = require("../models/Project");


router.get("/", asyncHandler(async(req, res) => {
  const projects = await project.find();
  res.status(200).json(projects);
}));

router.get("/:id",asyncHandler(async(req,res)=>{
   
      const pro = await project.findById(req.params.id);
     if(pro){
       res.status(200).json(pro);
    } else{
       res.status(404).json({message:"project not found "});
    }
    
}));
/**
 * creat new project 
 * @route /api/projects
 * @method Post
 * @access private (only admin)
 */
router.post("/", verifyTokenandAdmin,asyncHandler(async(req,res) => {
    const { error }= validateCreateProject(req.body);


 if(error){
   return res.status(400).json({ message:error.details[0].message});
 }



    const pro= new project({
        projectType:req.body.projectType,
        title:req.body.title,
        description:req.body.description,
        difficulty:req.body.difficulty,
        estimatedTimeToComplete:req.body.estimatedTimeToComplete,
        Skills:req.body.Skills,
        materialsneeded:req.body.materialsneeded,
        groupsize:req.body.groupsize
       });
     
      const result= await pro.save();
    
     res.status(201).json(result);


}));

/**
 * update project 
 * @route /api/projects
 * @method Post
 * @access private (only admin)
 */
router.put("/:id",verifyTokenandAdmin,asyncHandler(async(req,res)=>{
    const { error }= validateUpdateProject(req.body);


    if(error){
      return res.status(400).json({ message:error.details[0].message});
    }const pro = await project.findByIdAndUpdate(req.params.id,{
        $set: {
          projectType:req.body.projectType,
          title:req.body.title,
          description:req.body.description,
          difficulty:req.body.difficulty,
          estimatedTimeToComplete:req.body.estimatedTimeToComplete,
          Skills:req.body.Skills,
          materialsneeded:req.body.materialsneeded,
          groupsize:req.body.groupsize
        }
    
       },{new:true});
       res.status(200).json(pro);
       
 
}));

/**
 * Delete project 
 * @route /api/projects
 * @method Post
 * @access private (only admin)
 */

router.delete("/:id",verifyTokenandAdmin,asyncHandler(async(req,res)=>{
    
     const pro =await project.findById(req.params.id);
      if (pro) {
          await project.findByIdAndDelete(req.params.id);
          res.status(200).json({ message: "project has been deleted"});
      }
      else{
          res.status(404).json({ message: "project not found"});
      }
    
  }));







 module.exports =router;