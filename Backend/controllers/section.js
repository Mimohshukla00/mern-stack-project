const Course = require("../models/course");
const Section = require("../models/section");

exports.createSection = async (req, res) => {
  try {
    // Data fetch
    const { sectionName, courseId } = req.body;

    // Data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Create section
    const section = await Section.create({ sectionName });

    // Update course with section
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { sections: section._id } },
      { new: true }
    ).populate("sections"); // Populating sections after updating

    // Return response with populated course details
    res.status(201).json({
      message: "Section created successfully",
      section,
      course: updatedCourse, // Send back the updated course with populated sections
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create section",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionName || !sectionId) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    res.status(200).json({
      message: "Section updated successfully",
      section: updatedSection,
    });
  } catch (error) {}
};

// delted secction

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const section = await Section.findByIdAndDelete(sectionId);
    res.status(200).json({
      message: "Section deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete section",
      error: error.message,
    });
  }
};
