import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ValidationException } from "../errors/validation-exception";
import { ErrorCodes } from "../errors/error-codes";

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationException(ErrorCodes.VALIDATION_ERROR, errors.array());
    }
    next();
};