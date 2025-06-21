import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
    const isoTime = new Date(req.timestamp!).toISOString();
    
    const requestInfo = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body
    };

    const originalSend = res.send.bind(res);

    res.send = (body: any) => {
        const responseInfo = {
            statusCode: res.statusCode,
            body
        };

        console.log(`[${isoTime}] ${req.method} ${req.originalUrl}`);
        console.log(`>> Request: ${JSON.stringify(requestInfo, null, 2)}`);
        console.log(`>> Response: ${JSON.stringify(responseInfo, null, 2)}`);
        console.log('--------------------------------------------');

        return originalSend(body);
    };

    next();
};