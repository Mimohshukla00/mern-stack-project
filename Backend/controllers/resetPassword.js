// reset password

const User = require("../models/user");
const mailSender = require("../utls/mailSender");

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
    res.status(500).json({ message: "Internal server while resting password" });
  }
};
