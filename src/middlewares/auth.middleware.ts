import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.config';
import { CustomException } from '../errors/custom-exception';
import { ErrorCodes } from '../errors/error-code';

const authentication = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new CustomException(ErrorCodes.UNAUTHORIZED)

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, userRole: string };
        req.userId = decoded.userId;
        req.userRole = decoded.userRole;
        next();
    } catch {
        throw new CustomException(ErrorCodes.UNAUTHORIZED)
    }
};

export { authentication };