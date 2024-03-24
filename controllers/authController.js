const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const { User, validateRegisterUser, validateLoginUser } = require("../models/User");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
     user: process.env.USER_EMAIL,
     pass: process.env.USER_PASS,
  }
});


const register = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email })
  if (user) {
    return res.status(400).json({ message: "This user is already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  const result = await user.save();

  const mailOptions = {
    from: 'you@gmail.com',
    to: req.body.email,
    subject: 'Registration Successful',
    text: 'Congratulations! You have successfully registered.'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

  const { password, ...other } = result._doc;
  res.status(201).json({ ...other });
});

const login = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const mailOptions = {
    from: 'you@gmail.com',
    to: req.body.email,
    subject: 'Login Successful',
    text: 'You have successfully logged in.'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

  const { password: userPassword, ...other } = user._doc;
  res.status(200).json({ ...other });
});

module.exports = {
  register,
  login
};
