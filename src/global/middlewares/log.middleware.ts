import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
    const isoTime = new Date(req.timestamp!).toISOString();
    const MAX_LOG_BODY_LENGTH = 300;

    const reqJsonString = JSON.stringify(req.body ?? {});

    const requestInfo = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: reqJsonString.length > MAX_LOG_BODY_LENGTH
            ? reqJsonString.slice(0, MAX_LOG_BODY_LENGTH) + '... [truncated]'
            : reqJsonString
    };

    const originalSend = res.send.bind(res);

    res.send = (body: any) => {
        let truncatedBody: string;

        if (typeof body === 'object' && !Buffer.isBuffer(body)) {
            const jsonString = JSON.stringify(body);
            truncatedBody = jsonString.length > MAX_LOG_BODY_LENGTH
                ? jsonString.slice(0, MAX_LOG_BODY_LENGTH) + '... [truncated]'
                : jsonString;
        } else if (typeof body === 'string') {
            truncatedBody = body.length > MAX_LOG_BODY_LENGTH
                ? body.slice(0, MAX_LOG_BODY_LENGTH) + '... [truncated]'
                : body;
        } else if (Buffer.isBuffer(body)) {
            truncatedBody = `[Binary Buffer, length=${body.length}]`;
        } else {
            truncatedBody = String(body);
        }

        const responseInfo = {
            statusCode: res.statusCode,
            body: truncatedBody
        };

        console.log(`[${isoTime}] ${req.method} ${req.originalUrl}`);
        console.log(`>> Request: ${JSON.stringify(requestInfo, null, 2)}`);
        console.log(`>> Response: ${JSON.stringify(responseInfo, null, 2)}`);
        console.log('--------------------------------------------');

        return originalSend(body);
    };

    next();
};