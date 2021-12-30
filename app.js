const express = require("express");
const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");
const reviews = require("./routes/reviewsRoute");
const comments = require("./routes/commentRoute.js");
const conversation = require("./routes/conversatoinRoute.js");
const messages = require("./routes/messagesRoute.js");
const booking = require("./routes/bookingRoute.js");
const globalErrorHandler = require("./controllers/errorController.js");
const AppError = require("./utils/AppError");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const { instrument } = require("@socket.io/admin-ui");
// const SocketIo = require("./utils/SocketIo");
//   socket initalization
const socektIo = require("socket.io");
const http = require("http");
// cors
const cors = require("cors");

const app = express();

const httpServer = http.createServer(app);

const io = new socektIo.Server(httpServer, {
  cors: ["*", "https://admin.socket.io"],
});

const formatMessage = (username, msg) => {
  return {
    username,
    msg,
    time: moment().format("h:mm a"),
  };
};
//   users socket io area
let users = [];
//  join user
const joinUser = (currentUser) => {
  const found = users.findIndex((e) => e._id === currentUser._id);
  if (found === -1) {
    users.push(currentUser);
    return currentUser;
  }
};
const getUserById = (id) => {
  return users.find((e) => e._id === id);
};
io.on("connection", (socket) => {
  socket.on("joinRoom", (currentUser) => {
    const user = joinUser({ socketId: socket.id, ...currentUser });
    socket.join(user.email);
  });
  socket.on("sendMessage", (data) => {
    const user = getUserById(data.rceive);
    if (user) io.to(user.email).emit("msg", data);
  });
  socket.on("sendTyping", (data) => {
    console.log("data");
    const user = getUserById(data[1]);
    if (user) io.to(user.email).emit("isTyping", data[0]);
  });
  socket.on("disconnect", () => {
    const user = users.filter((e) => e.socketId !== socket.id);
    users = user;
  });
});
instrument(io, { auth: false });
app.use(cors({ origin: "*", credentials: true }));
app.options("*", cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", comments);
app.use("/api/v1/conversation", conversation);
app.use("/api/v1/messages", messages);
app.use("/api/v1/booking", booking);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't Find ${req.originalUrl} On This Server`, 404));
});
app.use(globalErrorHandler);

module.exports = httpServer;
