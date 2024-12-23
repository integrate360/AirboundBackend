const errorHandler = (err, req, res, next) => {
  // const statusCode = res.statusCode ==200?500:res.statusCode;
  // res.statusCode=statusCode;
  res.send({ message: err.message, stack: err.stack });
};

module.exports = { errorHandler };
