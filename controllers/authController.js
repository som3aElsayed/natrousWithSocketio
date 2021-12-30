const catchAsync = require("../utils/catchAsync");
const Email = require("../utils/Email");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.signUp = catchAsync(async function (req, res, next) {
  const { name, password, email, passwordConfirm } = req.body;

  const user = await User.create({ name, password, email, passwordConfirm });

  // send A  greeting
  await new Email(user, "Welcome To Natrous Family").sendWelcome();

  // token
  const token = user.createToken(user.id, res);
  user.password = undefined;
  res.status(201).json({ status: "success", token, data: { user } });
});

/// log in
exports.login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and passowrd!", 400));
  }
  // check if the user exists
  const user = await User.findOne({ email });
  // check if password correction
  if (!user || !(await user.isValidPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!", 401));
  }

  // token
  user.password = undefined;
  const token = user.createToken(user.id, res);
  res.status(200).json({ status: "success", token, data: { user } });
});

// log out
exports.logout = function (req, res) {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "loged out successfuly" });
};

// authProtection
exports.authProtection = catchAsync(async function (req, res, next) {
  let token =
    (req.headers.authorization && req.headers.authorization.split(" ")[1]) ||
    req.cookies.jwt;
  if (!token)
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  // check for jwt Secret
  const jwtVerifying = await jwt.verify(token, process.env.JWT_SECRET);

  // check if use still exists
  const currentuser = await User.findById(jwtVerifying.id);
  if (!currentuser) {
    return next(new AppError("The User Belong to This Token no longer exist."));
  }
  // check if password has changed ..
  req.user = currentuser;
  next();
});

exports.restirected = function (...params) {
  return (req, res, next) => {
    if (params.includes(req.user.role)) {
      return next();
    }
    next(new AppError("You Don't have permission to perform this action", 403));
  };
};

// forget-password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    next(new AppError("There is no use With That Email", 404));
  }
  // reset Password To Your Emaill
  try {
    const resetToken = user.createResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // const resetUrl = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/v1/users/reset-password/${resetToken}`;
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    await new Email(
      user,
      "Reset Your Password In Natrous website."
    ).sendResetPassword(resetUrl);
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new AppError(
        "There Was an Error in Sending an email, Try Again please!",
        500
      )
    );
  }
  // reset Password To Your Emaill
  res.status(200).json({ status: "Success", msg: "Check out Your Email" });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  const TokenVerifying = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: TokenVerifying,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is Invalid", 400));
  }
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // token
  const token = user.createToken(user.id, res);
  user.password = undefined;
  res
    .status(200)
    .json({ status: "Password Changed Successfuly", token, data: { user } });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, newPassword, passwordConfirm } = req.body;

  const user = await User.findById(req.user.id);

  if (!user || !(await user.isValidPassword(password, user.password)))
    return next(new AppError("Your Current Password is wrong", 401));

  const token = user.createToken(user.id, res);

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  user.password = undefined;

  res.status(200).json({ status: "Password Changed Successfuly", user });
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decode = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      // check if still exists
      const currentUser = await User.findById(decode.id);
      if (!currentUser) return next();
      // check if the user change his password

      // if(currentUser.changePasswordAfter(decode.iat))
      req.user = currentUser;
      return next();
    } catch (error) {
      return next();
    }
  }
  return next();
});
exports.allowUser = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.user ? req.user : "" });
});
