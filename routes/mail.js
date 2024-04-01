const express = require('express');
const router = express.Router();
const Weather = require('../models/weather'); // Assuming you have a Weather model
const nodemailer = require('nodemailer');

// Function to send email
async function sendEmail(email, cityName, weatherData) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'communicraftbackend@gmail.com', // Your Gmail email address
        pass: 'amna1hadeel2roaa3aya4@@@@' // Your Gmail password
      }
    });

    const mailOptions = {
      from: 'communicraftbackend@gmail.com', // Your Gmail email address
      to: email,
      subject: `Weather Update for ${cityName}`,
      text: `Weather in ${cityName}: ${weatherData}`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} with weather update for ${cityName}`);
  } catch (error) {
    console.error(`Error sending email to ${email}: ${error.message}`);
  }
}

// Route to fetch weather data and send email
router.get('/:city/:email', async (req, res) => {
  try {
    const cityName = req.params.city; // City name is assumed to be sent as a query parameter
    const email = req.params.email; // Email is assumed to be sent as a query parameter

    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Fetch weather data for the city from the database
    const weatherData = await Weather.findOne({ city: cityName });

    if (!weatherData) {
      return res.status(404).json({ error: 'Weather data not found for the city' });
    }

    // Send email with weather details
    await sendEmail(email, cityName, weatherData);
    
    res.json({ message: `Email sent to ${email} with weather update for ${cityName}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error occurred while sending email' });
  }
});

module.exports = router;
