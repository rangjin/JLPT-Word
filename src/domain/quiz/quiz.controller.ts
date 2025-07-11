import { Request, Response } from "express";
import { quizService } from "./quiz.service";
import { JLPTLevel } from "../word/word.model";
import { PickType } from "../word/word.repository";
import { randomUUID } from "crypto";

class QuizController {

    async init(req: Request, res: Response) {
        const userId = req.userId!;
        const uuid = randomUUID();
        const { total, pickType, level } = req.body;
        const levels = level.split(',') as JLPTLevel[];
        await quizService.createOrResetSession(userId, uuid, levels, pickType as PickType, total);
        const question = await quizService.sendQuestion(uuid);
        res.status(200).json({
            uuid: uuid, 
            question: question
        });
    }

    async answer(req: Request, res: Response) {
        const userId = req.userId!;
        const { uuid, reading, meaning } = req.body;
        const answer = await quizService.handleAnswer(uuid, reading, meaning);
        if (answer!.current >= answer!.total) {
            res.status(200).json({
                answer: answer, 
                result: await quizService.finish(userId, uuid)
            });
        } else {
            res.status(200).json({
                answer: answer, 
                question: await quizService.sendQuestion(uuid)
            });
        }
    }

}

export const quizController = new QuizController();