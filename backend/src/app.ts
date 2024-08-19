import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

dotenv.config();
const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/weblarek' } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(DB_ADDRESS);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(DB_ADDRESS);
});
