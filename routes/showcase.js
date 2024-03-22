const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { verifyTokenandAdmin } = require("../middleware/verifyToken");
const { showcase, validateCreateShowcase, validateUpdateShowcase } = require("../models/Showcase");
const { project } = require("../models/Project"); // Corrected import





/**
 * creat new showcase 
 * @route /api/projects/:id/showcases
 * @method Post
 * @access private (only admin)
 */

router.post("/", verifyTokenandAdmin,asyncHandler(async(req,res) => {
    const { error }= validateCreateShowcase(req.body);


 if(error){
   return res.status(400).json({ message:error.details[0].message});
 }



    const show= new showcase({
        project: req.body.id, 
        projectOwner: req.body.projectOwner,
        title: req.body.title,
        description: req.body.description,
        Team: req.body.Team
       });
     
      const result= await show.save();
    
     res.status(201).json(result);


}));

router.put("/:showcaseId", verifyTokenandAdmin, asyncHandler(async (req, res) => {
    const { error } = validateUpdateShowcase(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const show = await showcase.findByIdAndUpdate(req.params.showcaseId, { // Using req.params.showcaseId
        $set: {
            project: req.params.id,
            projectOwner: req.body.projectOwner,
            title: req.body.title,
            description: req.body.description,
            Team: req.body.Team
        }
    }, { new: true });

    res.status(200).json(show);
}));

router.delete("/:showcaseId", verifyTokenandAdmin, asyncHandler(async (req, res) => {
    const show = await showcase.findById(req.params.showcaseId); 
    if (show) {
        await showcase.findByIdAndDelete(req.params.showcaseId); 
        res.status(200).json({ message: "Showcase has been deleted" });
    } else {
        res.status(404).json({ message: "Showcase not found" });
    }
}));

module.exports = router;
