import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectDB } from './config/db.config';
import { authRouter } from './routers';
import { addTimeStamp, logger, errorHandler } from './middlewares';

const app = express();
const hostname = process.env.HOST!;
const port = parseInt(process.env.PORT!, 10);

connectDB();

app.use(express.json());
app.use(addTimeStamp);
app.use(logger);

app.use('/auth', authRouter);

app.use(errorHandler);

app.listen(port, hostname, () => {
    console.log(`Express Server is started at http://${hostname}:${port}`);
});