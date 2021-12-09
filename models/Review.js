// review / rating / mangoose
const mongoose = require("mongoose");
const Tour = require("../models/Tour");
const reviewsSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review Can't be Empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Review Can't be Empty"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review Must Belong To a user "],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Reivew Must belong to A tour"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewsSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewsSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};
reviewsSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewsSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcAverageRatings(doc.tour);
});

const Review = mongoose.model("Review", reviewsSchema);

module.exports = Review;
