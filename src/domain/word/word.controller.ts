import { Request, Response } from 'express';
import { wordService } from './word.service'
import { JLPTLevel } from './word.model';

class WordController {

    async createWords(req: Request, res: Response){
        const { words } = req.body;
        const result = await wordService.createWords(words);
        res.status(201).json(result);
    }

    async generatePdf(req: Request, res: Response) {
        const { level, type } = req.query;
        const levels = (level as string).split(',') as JLPTLevel[];

        const pdfBuffer = await wordService.getPdf(levels, type as string, req.userId! as string);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${level}.pdf"`);
        res.send(pdfBuffer);
    }
    
}

export const wordController = new WordController();