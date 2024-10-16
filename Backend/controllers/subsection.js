const subSection = require("../models/subsection");
const section = require("../models/section");
const { uploadImageToCloudinary } = require("../utls/imageUploader");

// create subsection
exports.createSubsection = async (req, res) => {
  try {
    // fetch data from body
    const { title, description, timeDuration, sectionId } = req.body;
    // extract file
    const video = req.files.videoFile;

    // validate data from body
    if (!title || !description || !timeDuration || !sectionId || !video) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // upload video to cloudinary
    const uploadVideo = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // create a sub section
    const subsection = await subSection.create({
      title,
      description,
      timeDuration,
      videoUrl: uploadVideo.url,
    });

    // update section with sub section
    await section.findByIdAndUpdate(sectionId, {
      $push: { subsections: subsection._id },
    });

    // fetch the updated section with populated subsections
    const updatedSection = await section
      .findById(sectionId)
      .populate("subsections"); // populating subsections

    // return response
    return res.status(200).json({
      message: "Subsection created successfully",
      subsection,
      section: updatedSection,
    });
  } catch (error) {
    console.error("Error creating subsection:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
