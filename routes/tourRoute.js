const express = require("express");
const tourController = require("../controllers/tourController.js");
const router = express.Router();
const reviewsRoute = require("../routes/reviewsRoute");
const authController = require("../controllers/authController");

router.use("/:tourId/reviews", reviewsRoute);

router
  .route("/")
  .get(authController.isLoggedIn, tourController.getAllTours)
  .post(
    authController.authProtection,
    authController.restirected("admin"),
    tourController.multerMultiFiles,
    tourController.adjustifyUploadImage(),
    tourController.createTour
  );
router
  .route("/:id")
  .get(authController.isLoggedIn, tourController.getTour)
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
