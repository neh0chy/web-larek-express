import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import cors from 'cors';
import path from 'path';
import router from './routes/index';
import { requestLogger, errorLogger } from './middlewares/logger';
import notFoundHandler from './middlewares/not-found-handler';
import errorHandler from './middlewares/error-handler';

const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/weblarek' } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(DB_ADDRESS);
app.use(requestLogger);
app.use(router);
app.use(notFoundHandler);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
