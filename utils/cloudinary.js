const cloudinary = require("cloudinary").v2;
module.exports = async (pathFile) => {
  return await cloudinary.uploader.upload(pathFile, {
    upload_preset: "natrous",
  });
};
