const express = require("express");
const router= express.Router();
const asyncHandler =require("express-async-handler");
const bcrypt =require("bcryptjs");
const {verifyTokenandAdmin}=require("../middleware/verifyToken");
const { project, validateCreateProject, validateUpdateProject } = require("../models/Project");


// router.get("/",asyncHandler(
//     async(req,res)=>{
//         const{pageNumber}= req.query;
//      const authorList = await Author.find().skip().limit(2);
//      res.status(200).json(authorList);
     
// }));

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


  /**
 * Get project name + team members
 * @route /api/projects
 * @method Get
 * @access public
 */

router.get("/:id/team",asyncHandler(async(req,res)=>{
    
  const pro =await project.findById(req.params.id);
   if (pro) {
       const projectname = pro.title
       const team = pro.teamMembers
       res.status(200).json({ projectname: projectname, team: team});
   }
   else{
       res.status(404).json({ message: "project not found"});
   }
 
}));


 /**
 * POST - Add team members
 * @route /api/projects
 * @method POST
 * @access private (only admin)
 */

 router.post("/:id/team", verifyTokenandAdmin, asyncHandler(async(req,res)=>{
    
  
  const memberName = req.body.memberName;
  const memberId = req.body.memberId;
  const memberRole = req.body.memberRole;
  
  try {
    const pro =await project.findByIdAndUpdate(req.params.id, { $push: { teamMembers: { memberName, memberId, memberRole } } } );
    if (!pro) {
      res.status(404).json({ message: "project not found"});
    }
    else {
      res.status(200).json(pro);
   
    }
        }
  catch (error) {
    res.status(404).json(error.message);
        }
       
   
 
}));


/**
 * PUT - Update team member's roles or permissions
 * @route /api/projects
 * @method PUT
 * @access private (only admin)
 */

router.put("/:id/team/:memberId", verifyTokenandAdmin, asyncHandler(async(req,res)=>{
    
  
  
  const memberId = req.params.memberId;
  const memberRole = req.body.memberRole;
  
  console.log(memberId)
  try {
    const pro = await project.findOneAndUpdate(
      { _id: req.params.id, "teamMembers.memberId": memberId },
      { $set: { "teamMembers.$.memberRole": memberRole } },
    );
    if (!pro) {
      res.status(404).json({ message: "project not found"});
    }
    else {
      res.status(200).json(pro);
   
    }
        }
  catch (error) {
    res.status(404).json(error.message);
        }
       
   
 
}));

/**
 * Delete - remove a team member from the project
 * @route /api/projects
 * @method DELETE
 * @access private (only admin)
 */

router.delete("/:id/team/:memberId", verifyTokenandAdmin, asyncHandler(async(req,res)=>{
    
  
  
  const memberId = req.params.memberId;
  
  
  try {
    const pro =await project.findOneAndUpdate({ _id: req.params.id }, { $pull: { teamMembers: { memberId: memberId } } });
    if (!pro) {
      res.status(404).json({ message: "project not found"});
    }
    else {
      res.status(200).json(pro);
   
    }
        }
  catch (error) {
    res.status(404).json(error.message);
        }
       
   
 
}));








 module.exports =router;