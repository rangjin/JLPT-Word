import { Router } from 'express';
import { wordController } from './word.controller';
import { authentication, isAdmin } from '../../global/middlewares/auth.middleware';
import { createWordsValidator } from './word.validator';
import { validate } from '../../global/middlewares/validation.middleware';

class WordRouter {
    
    public router: Router;

    constructor() {
        this.router = Router();
        this.registerRoutes();
    }

    private registerRoutes() {
            this.router.post('/', 
                authentication, isAdmin, createWordsValidator, validate, wordController.createWords);
        }

}

export const wordRouter = new WordRouter().router;