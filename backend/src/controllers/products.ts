import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/internal-server-error';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => Product.find({})
  .then((products) => res.send({ items: products, total: products.length }))
  .catch((error) => next(error.message));

export const addProduct = (req: Request, _res: Response, next: NextFunction) => {
  const {
    title, image, category, description, price,
  } = req.body;

  Product.create({
    title,
    image,
    category,
    description,
    price,
  }).catch((error) => {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError(error.message));
    }
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }

    return next(new InternalServerError(error.message));
  });
};
