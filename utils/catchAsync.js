const AppError = require("./AppError");
module.exports = function catchAsync(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(new AppError(error));
    }
  };
};
