const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  coord: {
    lon: { type: Number, required: true },
    lat: { type: Number, required: true }
  },
  weather: [{
    id: { type: Number, required: true },
    main: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }
  }],
  base: { type: String, required: true },
  main: {
    temp: { type: Number, required: true },
    feels_like: { type: Number, required: true },
    temp_min: { type: Number, required: true },
    temp_max: { type: Number, required: true },
    pressure: { type: Number, required: true },
    humidity: { type: Number, required: true }
  },
  visibility: { type: Number, required: true },
  wind: {
    speed: { type: Number, required: true },
    deg: { type: Number, required: true }
  },
  clouds: {
    all: { type: Number, required: true }
  },
  dt: { type: Number, required: true },
  sys: {
    type: { type: Number, required: true },
    id: { type: Number, required: true },
    country: { type: String, required: true },
    sunrise: { type: Number, required: true },
    sunset: { type: Number, required: true }
  },
  timezone: { type: Number, required: true },
  id: { type: Number, required: true },
  name: { type: String, required: true },
  cod: { type: Number, required: true }
});

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
