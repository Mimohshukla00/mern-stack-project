import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
  },
  Subsection: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subsection",
      required: true,
    },
  ],
});

const section = mongoose.model("Section", sectionSchema);
module.exports = section;
