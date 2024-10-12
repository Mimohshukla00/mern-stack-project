// reset password

const User = require("../models/user");
const mailSender = require("../utls/mailSender");
const bcrypt = require("bcrypt");

// reset password logic
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req
    const { email } = req.body;
    //check user for this email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // genrate token
    const token = crypto.randomUUID();

    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      {
        email: email,
      },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      {
        new: true,
      }
    );
    // create url
    const url = `http://localhost:3000/update-password/${token}`;
    // send email containg email
    await mailSender(
      email,
      "password rest link",
      `password reset link :${url}`
    );

    // send response
    res.status(200).json({ message: "password reset link sent" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server while creating email (url)" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;

    // validation
    if (password != confirmPassword) {
      return res
        .status(400)
        .json({ message: "password and confirm password should be same" });
    }
    // get user details from db using token
    const user = await User.findOne({ token });
    // if not entry
    if (!user) {
      return res.status(404).json({ message: "token is not found or invalid" });
    }

    // token time check
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "token is expired" });
    }
    // hash password
    const hashedPassword = await bcrypt(password, 10);

    // password update
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server while resetting password" });
  }
};
