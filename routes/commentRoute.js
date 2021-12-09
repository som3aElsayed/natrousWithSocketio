const express = require("express");
const commentController = require("../controllers/commentController");
const route = express.Router();

route
  .route("/")
  .get(commentController.getAllComment)
  .post(commentController.createComment);

module.exports = route;
