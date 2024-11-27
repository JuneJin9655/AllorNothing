import { error } from "console";
import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
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

export default errorHandler;