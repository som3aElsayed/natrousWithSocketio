const fs = require("fs");
module.exports = (pathFile) => {
  fs.unlink(pathFile, (err) => {
    if (err) return new AppError("unpxpected error try again late.", 500);
  });
};
