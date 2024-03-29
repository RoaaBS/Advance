const mongoose = require('mongoose');
const Joi = require('joi');

// Define the schema for the Weather model
const weatherSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  temperatureC: {
    type: Number,
    required: true
  },
  temperatureF: {
    type: Number,
    required: true
  }
});

// Create the Weather model
const Weather = mongoose.model('Weather', weatherSchema);

// Export the Weather model
module.exports = Weather;
