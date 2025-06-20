import express from 'express';
import 'dotenv/config';

const app = express();
const hostname = process.env.HOST || '127.0.0.1';
const port = parseInt(process.env.PORT || '5000', 10);

app.listen(port, hostname, () => {
    console.log(`Express Server is started at http://${hostname}:${port}`);
});