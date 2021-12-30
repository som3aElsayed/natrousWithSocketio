const catchAsync = require("../utils/catchAsync");
const Review = require("../models/Review");
const AppError = require("../utils/AppError");
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({})
    .populate({
      path: "user",
      select: "name photo",
    })
    .populate({
      path: "tour",
      select: "name",
    });
  res.status(200).json({ reviewCount: reviews.length, reviews });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  if (!req.body.user) {
    return res
      .status(401)
      .json({ failed: "for god' Sake  tour and user required" });
  }

  const review = await Review.create(req.body);
  res.status(200).json({ success: "success", review });
});
exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findOneAndRemove({
    user: req.user._id,
    _id: req.params.id,
  });
  if (!review)
    return next(
      new AppError("You are not Allowed Deleteing Other's Comments", 401)
    );
  res.status(204).json({ success: "deleted" });
});
exports.searchForReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndRemove(req.params.id);
  if (!review)
    return next(
      new AppError("You are not Allowed Deleteing Other's Comments", 401)
    );
  res.status(200).json({ success: "success", review });
});
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findOneAndUpdate(
    {
      user: req.user._id,
      _id: req.params.id,
    },
    req.body,
    { new: true, runValidators: true }
  );
  if (!review)
    return next(
      new AppError("You are not Allowed Deleteing Other's Comments", 401)
    );
  res.status(200).json({ success: "success", review });
});
