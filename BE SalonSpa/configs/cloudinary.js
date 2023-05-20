const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dunglv1520",
  api_key: "36722785ds6785429",
  api_secret: "0RBwLtdsd1ApoK2Ol_EhKbDBPbTkRQ",
  secure: true,
});

module.exports = cloudinary;
