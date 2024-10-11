import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  token: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "Student", "Instructor"],
    required: true,
  },
  additionalDetails: {
    type: mongoose.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  courses: [{ type: mongoose.Types.ObjectId, ref: "Course" }],

  image: {
    type: String,
    required: true,
  },
  resetPasswordExpires: {
    type: Date,
  },
  courseProgress: [
    {
      type: mongoose.Types.ObjectId,
      ref: "CourseProgress",
    },
  ],
});
const User = mongoose.model("User", userSchema);
module.exports = User;
