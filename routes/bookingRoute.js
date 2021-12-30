const express = require("express");
const route = express.Router();
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

route
  .route("/checkout-session/:tourId")
  .get(authController.authProtection, bookingController.createBookign);
route
  .route("/my-booking/:id")
  .get(authController.authProtection, bookingController.getAllMyBooking);

module.exports = route;
