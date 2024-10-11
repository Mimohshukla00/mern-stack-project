import mongoose from "mongoose";

const ProfleSchema = new mongoose.Schema({
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
});
const Profle = mongoose.model("Profle", ProfleSchema);
module.exports = Profle;
