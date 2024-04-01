const mongoose = require('mongoose');
const Joi = require('joi');

const CollaborativeSchema = new mongoose.Schema({
    ProjectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project', 
        required: true
    },

    teamMembers: {
        type: [{
          memberName: {
            type: String,
            required: true,
            trim: true
          },
          memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
      
          },
          memberRole: {
            type: String,
            required: true,
            trim: true
      
          }
        }]
        
      
      },



})

const collaborative = mongoose.model("collaborative", CollaborativeSchema);

function validateCreateCollaborative(obj) {
    const schema = Joi.object({
        ProjectID: Joi.string().trim().required(),
        teamMembers: Joi.array().items({memberName: Joi.string().trim().required(), memberId: Joi.string().trim().required(), memberRole: Joi.string().trim().required(), })
    });

    return schema.validate(obj);
}

module.exports = {
    collaborative,
    validateCreateCollaborative,
    
  };