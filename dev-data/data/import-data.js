const Tour = require("../../models/Tour");
const mongoose = require("mongoose");
const fs = require("fs");
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

const TourFile = fs.readFileSync(`${__dirname}/tours.json`, "utf-8");

const importData = async () => {
  try {
    await Tour.create(JSON.parse(TourFile));
    console.log("Updated Tour");
  } catch (error) {
    console.log(error);
  }
};

const deltedData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Updated Tour");
  } catch (error) {
    console.log(error);
  }
};

importData();
// if (process.argv[2] === "import") importData();
