import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import http from 'http';
import { connectDB } from './global/config/mongodb.config';
import { addTimeStamp, logger, errorHandler } from './global/middlewares';
import { userRouter } from './domain/user/user.router';
import { wordRouter } from './domain/word/word.router';
import { connectRedis } from './global/config/redis.config';
import { initGateway } from './domain/quiz/quiz.gateway';
import { WebSocketServer } from 'ws';

const app = express();
const hostname = process.env.HOST!;
const port = parseInt(process.env.PORT!, 10);

connectDB();
connectRedis();

app.use(express.json());
app.use(addTimeStamp);
app.use(logger);

app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('ok');
});
app.use('/user', userRouter);
app.use('/word', wordRouter);

app.use(errorHandler);

const server = http.createServer(app);
initGateway(server);

server.listen(port, hostname, () => {
    console.log(`Express Server is started at http://${hostname}:${port}`);
});