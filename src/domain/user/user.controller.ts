import { Request, Response } from "express";
import { userService } from "./user.service";

class UserController {

    async signup(req: Request, res: Response) {
        const { email, password } = req.body;
        const result = await userService.signup(email, password);
        res.status(201).json(result);
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const result = await userService.login(email, password);
        res.status(200).json(result);
    }
    
}

export const userController = new UserController();