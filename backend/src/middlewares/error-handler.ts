import {
  Request, Response, NextFunction, ErrorRequestHandler,
} from 'express';

const errorHandler: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка сервера' : message,
  });
  next(err);
};

export default errorHandler;
