import { Router } from "express";
import { validate } from "../../global/middlewares/validation.middleware";
import { authenticationValidator } from "./user.validator";
import { userController } from "./user.controller";
import { authentication } from "../../global/middlewares/auth.middleware";

class UserRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.router.post('/signup', 
            authenticationValidator, validate, userController.signup);
        this.router.post('/login', 
            authenticationValidator, validate, userController.login);
        this.router.put('/memorize', 
            authentication, userController.memorize);
        this.router.put('/unmemorize', 
            authentication, userController.unmemorize);
    }
    
}

export const userRouter = new UserRouter().router;