import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/product';
import Joi from 'joi';
import { faker } from '@faker-js/faker';
import BadRequestError from '../errors/bad-request-error'; // 400 - переданы некорректные данные в методы создания товара, заказа
import NotFoundError from '../errors/not-found-error'; // 404 - маршрут не найден
import ConflictError from '../errors/conflict-error'; // 409 - ошибка при создании товара с уже существующим полем title
import InternalServerError from '../errors/internal-server-error'; // 500 - ошибка по умолчанию
import { Error as MongooseError } from 'mongoose';

export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { payment, email, phone, address, total, items } = req.body;

  try {
    // проверка наличия необходимых полей
    if (!payment || !email || !phone || !address || !total || !items) {
      return next(new BadRequestError('Необходимо передать все поля'));
    }

    // проверка поля payment
    if (['card' || 'online'].includes(payment)) {
      return next(new BadRequestError('Неверный способ оплаты'));
    }

    // проверка поля email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
      return next(new BadRequestError(`Неверный email: ${email}`));
    }

    // проверка поля phone для формата РФ
    if (!/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(phone)) {
      return next(new BadRequestError(`Неверный номер телефона: ${phone}`));
    }

    // проверка поля total
    if (typeof total !== 'number' || total === 0) {
      return next(new BadRequestError('Неправильное значение поля total'));
    }

    // проверка поля items
    if (!Array.isArray(items) || items.length === 0) {
      return next(new BadRequestError('Неправильное значение поля items'));
    }

    // найти все товары, которые есть в пришедшем запросе и посчитать их сумму
    const products = await Product.find({ _id: { $in: items } });
    const productSum = products.reduce((sum, item) => {
      if (item.price !== null) {
        return sum + Number(item.price);
      }
      return sum;
    }, 0);

    // проверить, что переданный _id существует в базе
    if (items.length !== products.length) {
      return next(new BadRequestError('Передан неправильный id'));
    }

    // проверить, что стоимость переданных товаров в сумме равна total
    if (total !== productSum) {
      return next(
        new BadRequestError(
          'Неправильная сумма товаров. Возможно, передан товар, который не продается'
        )
      );
    }

    // отправка ответа с кодом
    return res.status(200).send({
      id: faker.string.uuid(),
      total: productSum
    });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
  }
};
