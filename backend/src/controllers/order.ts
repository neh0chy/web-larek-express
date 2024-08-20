import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/internal-server-error';
import { IOrder } from '../middlewares/validation';

const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { total, items } : IOrder = req.body;

  try {
    if (typeof total !== 'number' || total === 0) {
      return next(new BadRequestError('Неправильное значение поля total'));
    }

    if (!Array.isArray(items) || items.length === 0) {
      return next(new BadRequestError('Неправильное значение поля items'));
    }

    const products = await Product.find({ _id: { $in: items } });
    const productSum = products.reduce((sum, item) => {
      if (item.price !== null) {
        return sum + Number(item.price);
      }
      return sum;
    }, 0);

    if (items.length !== products.length) {
      return next(new BadRequestError('Передан неправильный id'));
    }

    if (total !== productSum) {
      return next(new BadRequestError('Неправильная сумма товаров'));
    }

    return res.status(200).send({
      id: faker.string.uuid(),
      total: productSum,
    });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    return next(new InternalServerError((error as Error).message));
  }
};

export default placeOrder;
