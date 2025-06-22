import { Request, Response } from "express";
import { authService } from "../service/auth.service";

class AuthController {

    async signup(req: Request, res: Response) {
        const { email, password } = req.body;
        const result = await authService.signup(email, password);
        res.status(201).json(result);
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json(result);
    }
    
}

export const authController = new AuthController();