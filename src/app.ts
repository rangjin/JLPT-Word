import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectDB } from './global/config/db.config';
import { addTimeStamp, logger, errorHandler } from './global/middlewares';
import { userRouter } from './domain/user/user.router';

const app = express();
const hostname = process.env.HOST!;
const port = parseInt(process.env.PORT!, 10);

connectDB();

app.use(express.json());
app.use(addTimeStamp);
app.use(logger);

app.use('/user', userRouter);

app.use(errorHandler);

app.listen(port, hostname, () => {
    console.log(`Express Server is started at http://${hostname}:${port}`);
});