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
    
    async memorize(req: Request, res: Response) {
        const { words } = req.body;
        const userId = req.userId!;
        const result = await userService.memorize(userId, words);
        res.status(200).json(result);
    }

    async unmemorize(req: Request, res: Response) {
        const { words } = req.body;
        const userId = req.userId!;
        const result = await userService.unmemorize(userId, words);
        res.status(200).json(result);
    }

}

export const userController = new UserController();