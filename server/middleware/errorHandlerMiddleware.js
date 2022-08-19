import { StatusCodes } from 'http-status-codes';

export const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
    details: err.details || {},
  };

  if (err.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
    customError.msg = err.message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code === 'Neo.ClientError.Statement.ParameterMissing') {
    (customError.msg = err.message),
      (customError.statusCode = StatusCodes.BAD_REQUEST);
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};
