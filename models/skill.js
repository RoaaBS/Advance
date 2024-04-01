const mongoose = require('mongoose');
const Joi = require('joi');


const skillSchema = new mongoose.Schema({
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    Name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100
    },
    profilepicture: {
        type: String
    },
    Skill: {
        type: String,
        enum: ['Knitting & Crocheting', 'Sewing & Quilting', 'Woodworking', 'Drawing', 'Jewelry Making', 'Photography', '3D Printing'],
        required: true
    },
    proficiency: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    interests: {
        type: String,
        enum: ['Knitting & Crocheting', 'Sewing & Quilting', 'Woodworking', 'Drawing', 'Jewelry Making', 'Photography', '3D Printing'],
        required: true
    },
    Participatedproject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', // Reference to the Project model
        required: true
    }
}, { timestamps: true });

const userskill = mongoose.model("userskill", skillSchema);

function validateCreateSkill(obj) {
    const schema = Joi.object({
        UserID: Joi.string().trim().required(),
        Name: Joi.string().trim().min(5).max(100).required(),
        profilepicture: Joi.string().allow('', null),
        Skill: Joi.string().valid('Knitting & Crocheting', 'Sewing & Quilting', 'Woodworking', 'Drawing', 'Jewelry Making', 'Photography', '3D Printing').required(),
        proficiency: Joi.string().trim().valid('beginner', 'intermediate', 'advanced').required(),
        interests: Joi.string().valid('Knitting & Crocheting', 'Sewing & Quilting', 'Woodworking', 'Drawing', 'Jewelry Making', 'Photography', '3D Printing').required(),
        Participatedproject: Joi.string().trim().required()
    });

    return schema.validate(obj);
}

module.exports = {
    userskill,
    validateCreateSkill,
};