const express = require("express");
const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");
const globalErrorHandler = require("./controllers/errorController.js");
const AppError = require("./utils/AppError");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't Find ${req.originalUrl} On This Server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
