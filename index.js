import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import fs from 'fs';
import Auth from './controllers/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

import { app, httpServer, io } from './server/server.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//---------CONFIGURATION
dotenv.config();

app.use(helmet());
app.use(morgan('common'));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

//------------STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userName = req.body.userName;

    const pathImg = path.join(__dirname, `public/assets/${userName}`);

    if (!fs.existsSync(pathImg)) {
      fs.mkdirSync(pathImg, { recursive: true });
    }

    cb(null, pathImg);
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//--------- ROUTING WITH FILE
app.post('/auth/register', upload.single('picture'), Auth.register);

//-------------ROUTING
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/public', express.static(path.join(__dirname, '/public')));

//---------CONNECTING TO DATABASE
app.use((req, res) => {
  res.status(404).json({ message: 'page-not-found' });
});

mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB Connection Error'));
db.once('open', () => console.log('Connected to MongoDB'));

httpServer.listen(process.env.PORT_BACKEND);
