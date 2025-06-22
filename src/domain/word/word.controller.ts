import { Request, Response } from 'express';
import { wordService } from './word.service'

class WordController {

    async createWords(req: Request, res: Response){
        const words = req.body;
        const result = await wordService.createWords(words);
        res.status(201).json(result);
    }
    
}

export const wordController = new WordController();