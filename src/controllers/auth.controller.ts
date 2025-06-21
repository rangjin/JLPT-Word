import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';

const signup = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const result = await AuthService.signup(email, password, name);
    res.status(result.status).json(result.body);
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.status(result.status).json(result.body);
};

export { signup, login };