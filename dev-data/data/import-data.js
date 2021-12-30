const Tour = require("../../models/Tour");
const mongoose = require("mongoose");
const fs = require("fs");
const User = require("../../models/User");
const Review = require("../../models/Review");
require("dotenv").config();

const DB = process.env.DATABASE_EMAIL.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));

const TourFile = fs.readFileSync(`${__dirname}/users.json`, "utf-8");

const importData = async () => {
  try {
    const users = await User.insertMany(JSON.parse(TourFile));
    console.log("Updated Tour");
  } catch (error) {
    console.log(error);
  }
};

const deltedData = async () => {
  try {
    await User.deleteMany();
    console.log("Updated Tour");
  } catch (error) {
    console.log(error);
  }
};

importData();
// if (process.argv[2] === "import") importData();
