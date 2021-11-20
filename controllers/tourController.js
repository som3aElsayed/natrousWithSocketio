const Tour = require("../models/Tour");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../utils/ApiFeatures");
const { uploadMulter, adjustifyImages } = require("../utils/uploadMulter");

module.exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Tour.find({}), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.tours;
  res.status(200).json({ ToursNumber: doc.length, success: doc });
});

module.exports.multerMultiFiles = uploadMulter().fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);
module.exports.adjustifyUploadImage = () => adjustifyImages(2000, 1333);
module.exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    success: "success",
    data: {
      data: tour,
    },
  });
});
module.exports.updateTour = catchAsync(async (req, res, next) => {
  console.log("req.body =>", { ...req.body });
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false,
  });
  if (!tour) {
    return next(new AppError("No Document Found With that Ip", 404));
  }
  res.status(200).json({
    success: "success",
    data: {
      data: tour,
    },
  });
});

module.exports.getTour = catchAsync(async (req, res, next) => {
  let theId = req.params.id.startsWith("the");
  if (theId) theId = { slugify: req.params.id };
  else theId = { _id: req.params.id };

  const tour = await Tour.find(theId);

  if (!tour) {
    return next(new AppError("No Document Found With that Ip", 404));
  }
  res.status(200).json({
    success: "success",
    tour,
  });
});
module.exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndRemove(req.params.id);

  if (!tour) {
    return next(new AppError("No Document Found With that Ip", 404));
  }
  res.status(204).json({
    success: "success",
    data: {
      data: null,
    },
  });
});
