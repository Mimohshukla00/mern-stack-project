const Tag = require("../models/tagSchema");

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    // validation of name and discription
    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "name and description are required" });
    }
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);
    res.status(201).json({ message: "tag created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error while creating tag" });
  }
};

// gett all tags
exports.getAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find(
      {},
      {
        name: true,
        description: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "all tags successfully",
      data: allTags,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error while fetching tags" });
  }
};
