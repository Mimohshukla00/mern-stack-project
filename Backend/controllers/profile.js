const Profile = require("../models/Profile");
const User = require("../models/user");

exports.updateProfile = async (req, res) => {
  try {
    // fetching data
    const { dateOfBirth = "", gender, contactNumber, about = "" } = req.body;

    // get user id
    const userId = req.user.id;
    // validate data
    if (!userId || !gender || !contactNumber) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // find user profile by user id
    const userDetails = await User.findById(userId);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update profile fields
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    profileDetails.about = about;

    // save the profile
    await profileDetails.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// delete account

exports.deleteAccount = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;

    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(400).json({ message: "User not found" });
    }

    await Profile.findByIdAndDelete({
      _id: userDetails.additionalDetails,
    });

    await User.findByIdAndDelete({
      _id: userId,
    });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting account" });
  }
};

// get all userdetails

exports.getAllUserDetails = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;

    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(400).json({ message: "User not found" });
    }

    const profileDetails = await Profile.findById(
      userDetails.additionalDetails
    );

    res.status(200).json({
      message: "User details fetched successfully",
      userDetails: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        accountType: userDetails.accountType,
        additionalDetails: {
          gender: profileDetails.gender,
          dateOfBirth: profileDetails.dateOfBirth,
          about: profileDetails.about,
          contactNumber: profileDetails.contactNumber,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching user details" });
  }
};
