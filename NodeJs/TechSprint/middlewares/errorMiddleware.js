const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Internal server error";

  if (
    err.statusCode === 404 &&
    (err.message === "Page Not Found" || err.message === "Api Not Found")
  ) {
    return res.status(404).send("<h1>Page/ Api not found</h1>");
  }

  return res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
  });

  // Send response with error details
};

export default errorMiddleware;
