import mongoose from 'mongoose';

export interface IProduct {
  title: String;
  image: {
    fileName: String;
    originalName: String;
  };
  category: String;
  description?: String;
  price?: String;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  image: {
    type: {
      fileName: String,
      originalName: String,
    },
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
    default: null,
  },
});

export default mongoose.model<IProduct>('product', productSchema);
