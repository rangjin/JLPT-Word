import { Router } from "express";
import { authController } from "../controller/auth.controller";

class AuthRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.router.post('/signup', authController.signup);
        this.router.post('/login', authController.login);
    }
    
}

export const authRouter = new AuthRouter().router;