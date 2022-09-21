import dotenv from 'dotenv';
import express from 'express';
import * as Cloudinary from 'cloudinary';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
dotenv.config();
import { initDriver } from './db/neo4j.js';
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { notFound } from './middleware/notFoundMiddleware.js';
import morgan from 'morgan';
import {
  authRouter,
  sportsRouter,
  sportTermsRouter,
  friendsRouter,
  friendRequestsRouter,
  teamsRouter,
  userRouter,
} from './routes/index.js';
import { recommendationsRouter } from './routes/recommendationsRoutes.js';

const clodinary = Cloudinary.v2;

clodinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(morgan('tiny'));
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.send('<h1>Sportski Termini App</h1>'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/sportTerms', authMiddleware, sportTermsRouter);
app.use('/api/v1/sportTerms/teams', authMiddleware, teamsRouter);
app.use('/api/v1/friends', authMiddleware, friendsRouter);
app.use('/api/v1/friendRequests', authMiddleware, friendRequestsRouter);
app.use('/api/v1/users', authMiddleware, userRouter);
app.use('/api/v1/sports', sportsRouter);
app.use('/api/v1/recommendations', authMiddleware, recommendationsRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const init = async () => {
  try {
    await initDriver(
      process.env.NEO4J_URI,
      process.env.NEO4J_USERNAME,
      process.env.NEO4J_PASSWORD
    );

    app.listen(port, () => console.log(`App listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

init();
