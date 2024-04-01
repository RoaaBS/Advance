const mongoose = require('mongoose');
const Joi = require('joi');

const resourceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    category: {
        type: String,
        enum: ['material', 'tool'],
        required: true
    },
    location: {
        type: String,
        trim: true
    },
    availability: {
        type: String,
        enum: ['available', 'unavailable'],
        required: true
    }
}, { timestamps: true });

const ResourceSharing = mongoose.model('ResourceSharing', resourceSchema);

function validateResourceSharing(obj) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        itemName: Joi.string().trim().min(3).max(200).required(),
        description: Joi.string().trim().min(3).max(200).required(),
        category: Joi.string().valid('material', 'tool').required(),
        location: Joi.string().allow('').trim().optional(),
        availability: Joi.string().valid('available', 'unavailable').required()
    });

    return schema.validate(obj);
}

module.exports = {
    ResourceSharing,
    validateResourceSharing
};