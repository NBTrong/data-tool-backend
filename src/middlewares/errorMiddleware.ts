/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import errorLogger from '@n-loggers/errorLogger';

function errorMiddleware(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  errorLogger.error(
    JSON.stringify({
      body: request.body,
      path: request.path,
      query: request.query,
      message: error.message,
      stack: error.stack,
    }),
  );
  const { code } = error;
  const { message } = error;
  const newError = {
    message,
    status: 'error',
  };
  response.status(code).send(newError);
}

export default errorMiddleware;
