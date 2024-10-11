const jwt = require("jsonwebtoken");

require("dotenv").config();
const User = require("../models/user");

exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: " token not found",
      });
    }
    // verify
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log(decoded);
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({
        message: "Invalid token",
      });
      next();
    }
  } catch (error) {
    return res.status(401).json({
      message: "something went wrong while validating token",
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType != "student") {
      return res.status(401).json({
        message: "You are not a student",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: "something went wrong while validating student",
    });
  }
};
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType != "isInstructor") {
      return res.status(401).json({
        message: "You are not a Instructor",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: "something went wrong while validating isInstructor",
    });
  }
};
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType != "isAdmin") {
      return res.status(401).json({
        message: "You are not a Admin",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: "something went wrong while validating isAdmin",
    });
  }
};
