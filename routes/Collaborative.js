const express = require("express");
const router= express.Router();
const asyncHandler =require("express-async-handler");
const bcrypt =require("bcryptjs");
const {verifyTokenandAdmin}=require("../middleware/verifyToken");
const { collaborative, validateCreateCollaborative} = require("../models/Collaborative");

 /**
 * Get project name + team members
 * @route /api/projects
 * @method Get
 * @access public
 */

 router.get("/:id/team",asyncHandler(async(req,res)=>{
    
    const pro =await collaborative.findOne({ProjectID: req.params.id}).populate('ProjectID');
     if (pro) {
         const projectname = pro.ProjectID.title
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
      const pro =await collaborative.findOneAndUpdate({ProjectID: req.params.id}, { $push: { teamMembers: { memberName, memberId, memberRole } } } );
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
      const pro = await collaborative.findOneAndUpdate(
        { ProjectID: req.params.id, "teamMembers.memberId": memberId },
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
      const pro =await collaborative.findOneAndUpdate({ ProjectID: req.params.id }, { $pull: { teamMembers: { memberId: memberId } } });
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