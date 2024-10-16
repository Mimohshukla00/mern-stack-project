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

    // find user by id
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting account" });
  }
};
