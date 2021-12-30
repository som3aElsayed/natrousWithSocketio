const express = require("express");
const tourController = require("../controllers/tourController.js");
const router = express.Router();
const reviewsRoute = require("../routes/reviewsRoute");
const authController = require("../controllers/authController");
const Booking = require("../models/Booking");
router.use("/:tourId/reviews", reviewsRoute);

const omg = async (req, res, next) => {
  console.log(req.query);
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();
  const omg = await Booking.create({ tour, user, price });
  console.log(omg);
  res.redirect(req.originalUrl.split("?")[0]);
  next();
};
router
  .route("/")
  .get(omg, tourController.getAllTours)
  .post(
    authController.authProtection,
    authController.restirected("admin"),
    tourController.multerMultiFiles,
    tourController.adjustifyUploadImage(),
    tourController.createTour
  );
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.authProtection,
    authController.restirected("admin"),
    tourController.multerMultiFiles,
    tourController.adjustifyUploadImage(),
    tourController.updateTour
  )
  .delete(authController.restirected("admin"), tourController.deleteTour);

// router.use([
// authController.authProtection,
// authController.restirected("admin"),
// tourController.multerMultiFiles,
// ]);
// router
// .route("/")
// .post(tourController.adjustifyUploadImage(), tourController.createTour);

module.exports = router;
