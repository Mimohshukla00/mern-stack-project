import mongoose from "mongoose";
import mailSender from "../utls/mailSender";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

// to send email
const sendEmail = async (email, otp) => {
  try {
    const mailResponse = await mailSender(email, "OTP Verification", otp);
    console.log(mailResponse);
  } catch (error) {
    console.log("error occured while  sending email", error);
  }
};
// to send email
otpSchema.pre("save", async function (next) {
  await sendEmail(this.email, this.otp);
  next();
});

const otpModel = mongoose.model("otp", otpSchema);
module.exports = otpModel;
