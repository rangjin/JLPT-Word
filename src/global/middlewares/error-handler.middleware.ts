import { ErrorRequestHandler } from 'express';
import { CustomException } from '../errors/custom-exception';
import { ErrorCodes } from '../errors/error-codes';
import { ValidationException } from '../errors/validation-exception';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ValidationException) {
        res.status(err.status).json({
            status: err.status,
            message: err.message,
            requestUri: req.originalUrl,
            errors: err.errors
        });
        return;
    }

    if (err instanceof CustomException) {
        res.status(err.status).json({
            status: err.status,
            message: err.message,
            requestUri: req.originalUrl,
        });
        return;
    }

    console.error('Unhandled Error:', err);

    res.status(500).json({
        status: 500,
        message: ErrorCodes.INTERNAL_SERVER_ERROR.message,
        requestUri: req.originalUrl,
    });
};