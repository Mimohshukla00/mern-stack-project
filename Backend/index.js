const express = require("express");
const { connectDB } = require("./config/db");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

// const axios = require("axios");

// const firstname = "John"; // Replace with actual first name
// const lastname = "Doe"; // Replace with actual last name

// const url = `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`;

// axios
//   .get(url)
//   .then((response) => {
//     console.log("SVG URL:", url);
//     console.log("SVG Content:", response.data); // SVG data
//   })
//   .catch((error) => {
//     console.error("Error fetching SVG:", error);
//   });
