const slugify = require("slugify");
const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    imageCover: {
      type: Object,
      required: [true, "coverImage Should be addedd."],
    },
    name: {
      type: String,
      required: [true, "Name Should be Addedd."],
    },
    difficulty: {
      type: String,
      required: [true, "difficulty Should be Addedd."],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either easy, medium , difficult",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "summary Should be Addedd."],
    },
    images: {
      type: Array,
      require: [true, "you should add three Images"],
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      adress: String,
      description: String,
    },
    locations: [Object],
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      required: [true, "rating Should be Addedd."],
      min: [1, "Rating at Least needs to be 1"],
      max: [5, "Rating at above needs to be 5"],
    },
    price: {
      type: Number,
      required: [true, "Price at Least needs to be 1"],
    },
    startDates: {
      type: [String],
      required: [true, "Should have date"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    description: {
      type: String,
      required: [true, "A tour must have a description"],
    },
    slugify: String,
    __v: { type: Number, select: false },
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    // reviews: [{ type: mongoose.Schema.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1 });
tourSchema.index({ slug: 1 });

tourSchema.pre("save", function (next) {
  this.slugify = slugify(this.name, { lower: true });
  next();
});

// Virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt -password",
  }).populate("reviews");

  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
