const User = require("../models/user");
const OTP = require("../models/otp");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utls/mailSender");
require("dotenv").config();

// send otp
exports.sendOTP = async (req, res) => {
  try {
    // fetch email
    const { email } = req.body;

    // check email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ message: "User already exists", success: false });
    }

    var generatedOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log(generatedOtp);

    // check if OTP is unique
    let result = await OTP.findOne({ otp: generatedOtp });
    while (result) {
      generatedOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: generatedOtp });
    }

    const otpPayload = { email, otp: generatedOtp };
    // create an OTP entry in DB
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      message: "OTP sent successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error sending OTP",
    });
  }
};

// signup
exports.signup = async (req, res) => {
  try {
    // fetch data from body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    // password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        success: false,
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // find the most recent OTP
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    // validate OTP
    if (!recentOtp || recentOtp.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      contactNumber,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return response
    res.status(200).json({
      message: "User registered successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error occurred during signup",
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    // fetch email,password
    const { email, password } = req.body;
    // validate data form req
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
        success: false,
      });
    }
    //user exits or not check
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "user does not exists",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      const payload = {
        user: user._id,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      user.token = token;
      user.password = undefined;

      // create cookie

      const options = {
        expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };

      res.cookie("token", token, options).status(200).json({
        message: "User logged in successfully",
        success: true,
        token,
        user,
      });
    } else {
      return res.status(401).json({
        message: "Invalid password while login",
      });
    }

    // genrate jwt
    // after that check password to bcrypt
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "user is not logged in",
      success: false,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    // Get data from req.body
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New Password and confirm password must be the same",
      });
    }

    // Retrieve user from database (adjust according to your logic)
    const user = await User.findById(req.user.id); // Ensure req.user is set properly (e.g., by authentication middleware)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Send email for password update
    await mailSender({
      email: user.email,
      name: firstName,
      subject: "Password Updated",
      message: "Your password has been updated successfully",
      // Make sure user.name is available
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res
      .status(500)
      .json({ message: "Something went wrong while changing password" });
  }
};
