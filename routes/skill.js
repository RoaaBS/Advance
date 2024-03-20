const express = require("express");
const router= express.Router();
const asyncHandler =require("express-async-handler");
//const bcrypt =require("bcryptjs");
//const {verifyTokenandAdmin}=require("../middleware/verifyToken");
const { userskill, validateCreateSkill } = require("../models/skill");

/**
 * creat new project 
 * @route /api/projects
 * @method Post
 * @access private 
 */
router.post("/",asyncHandler(async(req,res) => {
    const { error }= validateCreateSkill(req.body);


 if(error){
   return res.status(400).json({ message:error.details[0].message});
 }



    const skill= new userskill({

        UserID: req.body.UserID,
        Name: req.body.Name,
        profilepicture:req.body.profilepicture,
        Skill: req.body.Skill,
        proficiency:req.body.proficiency,
        interests: req.body.interests,
        Participatedproject:req.body.Participatedproject,

       });
     
      const result= await skill.save();
    
     res.status(201).json(result);

    }));


/**
 * Get All users with a certain skill
 * @route GET /api/skill/:skill/s
 * @access public
 */


router.get("/:skill/s", asyncHandler(async (req, res) => {
  const skill = req.params.skill;

  try {
      const usersWithSkill = await userskill.find({ Skill: skill });

      if (usersWithSkill.length > 0) {
          // Extracting necessary user details
          const users = usersWithSkill.map(user => ({
              UserID: user.UserID,
              Name: user.Name,
              skill: user.Skill,
              profilepicture: user.profilepicture,
              proficiency: user.proficiency,
              interests: user.interests,
              Participatedproject: user.Participatedproject
          }));
          res.status(200).json({ users: users });
      } else {
          res.status(404).json({ message: "No users found with the skill" });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
}));

/**
 * Get All users with a certain interests
 * @route GET /api/skill/:skill/i
 * @access public
 */


router.get("/:interests/i", asyncHandler(async (req, res) => {
  const interests = req.params.interests;

  try {
      const usersInterests = await userskill.find({ interests: interests });

      if (usersInterests.length > 0) {
          // Extracting necessary user details
          const users = usersInterests.map(user => ({
              UserID: user.UserID,
              Name: user.Name,
              skill: user.Skill,
              profilepicture: user.profilepicture,
              proficiency: user.proficiency,
              interests: user.interests,
              Participatedproject: user.Participatedproject
          }));
          res.status(200).json({ users: users });
      } else {
          res.status(404).json({ message: "No users found with the interests " });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
}));


/**
 * PUT - Update any thing in skill table
 * @route /api/skillid
 * @method PUT
 * @access private 
 */


router.put("/:skillid", asyncHandler(async (req, res) => {
  
  const skillput= await userskill.findByIdAndUpdate(req.params.skillid, { 
      $set: {
        UserID: req.body.UserID,
        Name: req.body.Name,
        profilepicture:req.body.profilepicture,
        Skill: req.body.Skill,
        proficiency:req.body.proficiency,
        interests: req.body.interests,
        Participatedproject:req.body.Participatedproject,

      }
  }, { new: true });

  res.status(200).json(skillput);
}));


router.delete("/:skillId", asyncHandler(async (req, res) => {
  const deleteskill = await userskill.findById(req.params.skillId); 
  if (deleteskill) {
      await userskill.findByIdAndDelete(req.params.skillId); // Using req.params.showcaseId
      res.status(200).json({ message: "skill has been deleted" });
  } else {
      res.status(404).json({ message: "Sskill not found" });
  }
}));

module.exports =router;