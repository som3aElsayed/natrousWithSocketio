const Mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new Mongoose.Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
    minlength: 8,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (el) {
        if (el !== this.password) return false;
      },
      message: "Password are not the same ",
    },
  },
  photo: { type: String, default: "default.jpg" },
  user_cloudinary_Id: String,
  role: {
    type: String,
    default: "user",
  },
  passwordResetToken: String,
  passwordResetExpires: String,
  active: {
    type: Boolean,
    select: false,
    default: true,
  },
  __v: { type: Number, select: false },
});

// hash password to Db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// password Correction
userSchema.methods.isValidPassword = async function (
  givenPassword,
  realPassword
) {
  return await bcrypt.compare(givenPassword, realPassword);
};

userSchema.methods.createToken = function (id, res) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
    path: "/",
  });
  return token;
};
userSchema.methods.createResetPasswordToken = function () {
  const resetHash = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetHash)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 1000 * 60;

  return resetHash;
};
const User = Mongoose.model("User", userSchema);

module.exports = User;
