const { statusCodes } = require("../enums/statusCodes");

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode || statusCodes.INTERNAL_SERVER_ERROR;

    // Determine if the error is a user-friendly error message
    const isUserFriendly = err.isUserFriendly || false;

    // Log the error for debugging purposes
    console.error(`Error: ${err.message}`);
    console.error(err.stack);
    if (statusCode == 500) {
        // Set the status code and send the response
        res.status(statusCode).json({
            title: isUserFriendly ? "Error" : "Internal Server Error",
            message: isUserFriendly ? err.message : "Something went wrong",
            stackTrace: isUserFriendly ? undefined : err.stack,
        });
    } else {
        res.status(statusCode).json({
            title: err.message,
            message: err.message,
            stackTrace: err.stackTrace,
        })
    }
};

module.exports = errorHandler;
