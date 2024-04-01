const mongoose = require('mongoose');
const Joi = require('joi');

const showcaseSchema = new mongoose.Schema({

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
},
  projectOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
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
   
  Team: {
   type: String,
     required: true,
     trim: true,
     minlength:3,
     maxlength:200,
   
  }
  
  },{
    timestamps:true
  });



  const showcase =mongoose.model("showcase",showcaseSchema);

  function validateCreateShowcase(obj) {
    const schema = Joi.object({
        project: Joi.string().trim().required(),
        projectOwner: Joi.string().trim().required(),
        title: Joi.string().trim().min(3).max(200).required(),
        description: Joi.string().trim().min(3).max(200).required(),
        Team: Joi.string().trim().min(3).max(200).required(),
    });
    return schema.validate(obj);
}


function validateUpdateShowcase(obj) {
  const schema = Joi.object({
    project: Joi.string().required(), 
    projectOwner: Joi.string().required(),
    title: Joi.string().trim().min(3).max(200).required(),
    description:Joi.string().trim().min(3).max(200).required(),
    Team: Joi.string().trim().min(3).max(200).required(),
    });
 
   return schema.validate(obj);
}
module.exports = {
    showcase,
    validateCreateShowcase,
  validateUpdateShowcase
};
