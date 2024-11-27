"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    const errorResponse = {
        success: false,
        error: {
            message: err.message || 'Internal server error',
            tupe: err.type || 'ServerError',
            code: statusCode,
        },
    };
    res.status(statusCode).json(errorResponse);
};
exports.default = errorHandler;
