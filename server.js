require("dotenv").config();
const connectDb = require("./utils/DB");

const app = require("./app");

// database Connection
const DB = process.env.DATABASE_EMAIL.replace(
  `<password>`,
  process.env.DATABASE_PASSWORD
);

const port = process.env.PORT || 4000;

async function start() {
  await connectDb(DB);
  app.listen(port, () => console.log("Server connection is stable"));
}
start();
