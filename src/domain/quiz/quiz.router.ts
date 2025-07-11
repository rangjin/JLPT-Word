import { Router } from "express";
import { authentication } from "../../global/middlewares/auth.middleware";
import { quizController } from "./quiz.controller";

class QuizRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.router.post('/init', authentication, quizController.init);

        this.router.post('/answer', authentication, quizController.answer);
    }
    
}

export const quizRouter = new QuizRouter().router;