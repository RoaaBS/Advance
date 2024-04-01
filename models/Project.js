const mongoose = require('mongoose');
const Joi = require('joi');




const ProjectSchema = new mongoose.Schema({
  projectType:{
      type:String,
      required:true,
      trim:true,
      minlength:3,
      maxlength:200,
  },
  title:{
      type:String,
      required:true,
      trim:true,
      minlength:3,
      maxlength:200,
  },
  description:{
      type:String,
      required:true,
      trim:true,
      minlength:3,
      maxlength:200,
  },
  difficulty:{
    type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true,
        trim: true,
},
  estimatedTimeToComplete: {
   type: String,
   required:true
 },
 Skills:{
   type:String,
   required:true,
   trim:true,
   minlength:3,
   maxlength:200,
 }, 
 materialsneeded:{
   type:String,
   required:true,
   trim:true,
   minlength:3,
   maxlength:200,
 },
groupsize: {
 type: String,
   enum: ['individual', 'small group', 'large group'],
   required: true,
   trim: true,
 
},

},{
  timestamps:true
});






const project =mongoose.model("project",ProjectSchema);

function validateCreateProject(obj) {
  const schema = Joi.object({
    projectType: Joi.string().trim().min(3).max(200).required(),
      title: Joi.string().trim().min(3).max(200).required(),
      description:Joi.string().trim().min(3).max(200).required(),
      difficulty:Joi.string().trim().valid('beginner', 'intermediate', 'advanced').required(),
      estimatedTimeToComplete:Joi.string().required(),
      Skills:Joi.string().trim().min(3).max(200).required(),
      materialsneeded:Joi.string().trim().min(3).max(200).required(),
      groupsize: Joi.string().trim().valid('individual', 'small group', 'large group').required()
    });
 
   return schema.validate(obj);
}





function validateUpdateProject(obj) {
  const schema = Joi.object({
    projectType: Joi.string().trim().min(3).max(200).required(),
    title: Joi.string().trim().min(3).max(200).required(),
    description:Joi.string().trim().min(3).max(200).required(),
    difficulty:Joi.string().trim().valid('beginner', 'intermediate', 'advanced').required(),
    estimatedTimeToComplete:Joi.string().required(),
    Skills:Joi.string().trim().min(3).max(200).required(),
    materialsneeded:Joi.string().trim().min(3).max(200).required(),
    groupsize: Joi.string().trim().valid('individual', 'small group', 'large group').required()
    });
 
   return schema.validate(obj);




}
module.exports = {
  project,
  validateCreateProject,
  validateUpdateProject
};
