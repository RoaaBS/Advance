const express = require('express');
const router = express.Router();
const axios = require('axios');
const Weather = require('../models/weather'); // Assuming you have a Weather model

router.get('/', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://weather-api138.p.rapidapi.com/weather',
      params: {
        city_name: 'Fergana' // You can replace 'Fergana' with user's location
      },
      headers: {
        'X-RapidAPI-Key': '626a8d932fmsha3053d21ec1f47bp128d8djsn053a421c811f',
        'X-RapidAPI-Host': 'weather-api138.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);

    // Assuming the response contains weather data
    const weatherData = response.data;

    // Create a new weather document
    const newWeather = new Weather({
      coord: weatherData.coord,
      weather: weatherData.weather,
      base: weatherData.base,
      main: weatherData.main,
      visibility: weatherData.visibility,
      wind: weatherData.wind,
      clouds: weatherData.clouds,
      dt: weatherData.dt,
      sys: weatherData.sys,
      timezone: weatherData.timezone,
      id: weatherData.id,
      name: weatherData.name,
      cod: weatherData.cod
    });

    // Save the weather document to the database
    await newWeather.save();

    res.json({ message: 'Weather data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error occurred while fetching or saving weather data' });
  }
});

module.exports = router;
