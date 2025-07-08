import { Request, Response } from 'express';
import { wordService } from './word.service'
import { JLPTLevel } from './word.model';
import { PickType } from './word.repository';

class WordController {

    async createWords(req: Request, res: Response){
        const { words } = req.body;
        const result = await wordService.createWords(words);
        res.status(201).json(result);
    }

    async generatePdf(req: Request, res: Response) {
        const { level, type } = req.query;
        const levels = (level as string).split(',') as JLPTLevel[];

        const pdfStream = await wordService.getPdfStream(levels, type as PickType, req.userId!);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition',`attachment; filename="${level}.pdf"`,);

        pdfStream.pipe(res);
    }
    
}

export const wordController = new WordController();