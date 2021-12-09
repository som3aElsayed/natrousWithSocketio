const express = require("express");
const reviewController = require("../controllers/reviewController.js");
const authController = require("../controllers/authController");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(authController.authProtection, reviewController.createReview);

router
  .route("/:id")
  .delete(authController.authProtection, reviewController.deleteReview)
  .patch(authController.authProtection, reviewController.updateReview)
  .get(reviewController.searchForReview);

router
  .route("/:tourId/reviews")
  .post(authController.authProtection, reviewController.createReview);

module.exports = router;
