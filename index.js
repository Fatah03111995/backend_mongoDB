import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';

//---------configuration
dotenv.config();
const app = express();

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

//---------CONNECTING TO DATABASE
mongoose
  .connect(process.env.MONGO_URL)
  .then(
    app.listen(process.env.PORT_BACKEND, () =>
      console.log(`LISTENING MONGO DB FROM PORT : ${process.env.PORT_BACKEND}`)
    )
  )
  .catch((e) => console.log(`ERROR : ${e}`));
