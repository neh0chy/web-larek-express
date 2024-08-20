import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/product';

export const getProducts = (req: Request, res: Response, next: NextFunction) =>
  Product.find({})
    .then((products) => res.send({ items: products, total: products.length }))
    .catch((err) => res.status(500).send({ message: err }));
// .catch((error) => next(error.message));

export const addProduct = (req: Request, res: Response, next: NextFunction) => {
  const { title, image, category, description, price } = req.body;
  Product.create({
    title,
    image,
    category,
    description,
    price
  }).catch((err) => res.status(500).send({ message: err }));
};
// .catch((error) => next(error.message));
