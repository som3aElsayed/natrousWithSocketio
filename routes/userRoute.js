const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const path = require("path");
const router = express.Router();

router.route("/login").post(authController.login);
router.route("/signup").post(authController.signUp);
router
  .route("/logout")
  .get(authController.authProtection, authController.logout);

// forget password
router.route("/forgot-password").post(authController.forgotPassword);
router.route("/reset-password/:resetToken").post(authController.resetPassword);
router
  .route("/update-password")
  .post(authController.authProtection, authController.updatePassword);

router
  .route("/delete-me")
  .post(authController.authProtection, userController.deleteMe);

router
  .route("/update-me")
  .post(
    authController.authProtection,
    userController.uploadSinglePhoto,
    userController.adjustifyUploadImage(),
    userController.updateMe
  );
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// admin area
router.use(authController.authProtection, authController.restirected("admin"));
router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
