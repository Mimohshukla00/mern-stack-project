const Course = require("../models/course");
const Tag = require("../models/tagSchema");
const User = require("../models/user");

const { uploadImageToCloudinary } = require("../utls/imageUploader");

// createCourse handler

exports.createCourse = async (req, res) => {
  try {
    // fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    // get thumbnail
    const thumbnail = req.files.thumbnailImage;
    // valiadation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    // check for instructor
    const instructor = await User.findById(req.user._id);
    if (!instructor) {
      return res.status(400).json({ message: "You are not an instructor" });
    }

    // check given tag is valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(400).json({ message: "Invalid tag" });
    }

    //upload image to cloudinary
    const uploadedThumbnail = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    // create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: uploadedThumbnail.secure_url,
    });

    // add the new schema  to the instructor

    await User.findByIdAndUpdate(
      { _id: instructorDetails },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      {
        new: true,
      }
    );

    // send response
    res.status(201).json({ message: "Course created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server while course creation" });
  }
};

// get all courses
export const getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      message: "Courses fetched successfully",
      courses: allCourses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "cannot fetch courses" });
  }
};
