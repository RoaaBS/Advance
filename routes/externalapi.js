const express = require('express');
const router = express.Router();
const axios = require('axios');
const Weather = require('../models/weather'); // Assuming you have a Weather model

router.get('/:city', async (req, res) => {
  try {
    const city = req.params.city; // Extracting city from query parameters
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const options = {
      method: 'GET',
      url: 'https://cities-temperature.p.rapidapi.com/weather/v1',
      params: { city: city }, // Setting city parameter dynamically
      headers: {
        'X-RapidAPI-Key': '626a8d932fmsha3053d21ec1f47bp128d8djsn053a421c811f',
        'X-RapidAPI-Host': 'cities-temperature.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    const weatherData = response.data;

    const newWeather = new Weather({
      city: weatherData.city,
      temperature: weatherData.temperature,
      temperatureC: weatherData.temperatureC,
      temperatureF: weatherData.temperatureF,
    });

    await newWeather.save();

    res.json({ message: 'Weather data saved successfully', weather: weatherData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error occurred while fetching or saving weather data' });
  }
});

module.exports = router;
