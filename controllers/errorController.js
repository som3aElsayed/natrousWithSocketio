module.exports = (err, req, res, next) => {
  const msg = err.message || "there is sth wrong happend please try again.";
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    msg,
  });
};
