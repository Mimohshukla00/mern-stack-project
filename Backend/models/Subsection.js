import mongoose from "mongoose";

const subSectionProgress = new mongoose.Schema({
  title: {
    type: String,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
});
const subsection = mongoose.model("Subsection", subSectionProgress);
module.exports = subsection;
