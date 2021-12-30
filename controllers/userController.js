const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");
const deleteTheCreatedFile = require("../utils/deleteTheCreatedFile");
const { uploadMulter, adjustifyOneImage } = require("../utils/uploadMulter");
const AppError = require("../utils/AppError");

exports.getAllUsers = catchAsync(async function (req, res, next) {
  const users = await User.find({});
  res.status(200).json({ status: "success", users });
});
exports.getUser = catchAsync(async function (req, res, next) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ status: "NotFound" });
  res.status(200).json({ status: "success", user });
});
exports.updateUser = catchAsync(async function (req, res, next) {
  res.status(200).json({ status: "success" });
});
exports.deleteUser = catchAsync(async function (req, res, next) {
  res.status(200).json({ status: "success" });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  res.status(200).json({
    status: "Success",
    data: user,
  });
});

exports.uploadSinglePhoto = uploadMulter().single("photo");
exports.adjustifyUploadImage = () => adjustifyOneImage(500, 500, "users");

exports.updateMe = catchAsync(async function (req, res, next) {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }
  const user = await User.findById(req.user.id).select("-password");
  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  // for upload image file
  if (req.image) {
    const { image, pathFile } = req.image;
    user.photo = image.secure_url;
    user.user_cloudinary_Id = image.public_id;
    deleteTheCreatedFile(pathFile);

    const images = req.images;
    user.images = images;
  }
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
