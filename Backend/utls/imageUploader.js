const cloudinary = require("cloudinary");

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder }; // Define options for the upload, including the folder

  // If the height is provided, add it to the options
  if (height) options.height = height;

  // If the quality is provided, add it to the options
  if (quality) options.quality = quality;

  // Ensure that Cloudinary automatically detects the resource type (image, video, etc.)
  options.resource_type = "auto";

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
