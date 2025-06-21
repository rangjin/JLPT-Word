import 'express';

declare module 'express' {
    interface Request {
        timestamp?: number;
        userId?: string;
        userRole?: string;
    }
};