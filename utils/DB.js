const mongoose = require("mongoose");

const connectDb = async (DB) => {
  await mongoose
    .connect(DB, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("db Connection is done");
    });
};

module.exports = connectDb;
