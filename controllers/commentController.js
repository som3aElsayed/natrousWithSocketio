const Comments = require("../models/Comments");
const catchAsync = require("../utils/catchAsync");
exports.getAllComment = catchAsync(async (req, res, next) => {
  const newComment = await Comments.find({}).populate("user");
  res.status(200).json(newComment);
});

exports.createComment = catchAsync(async (req, res, next) => {
  const newComment = await Comments.create(req.body);
  res.status(200).json({ sucess: newComment });
});
