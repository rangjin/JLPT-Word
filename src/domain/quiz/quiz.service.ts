import { WebSocket } from "ws";
import { shuffleArray } from "../../global/utils/shuffle.util";
import { JLPTLevel } from "../word/word.model";
import { PickType, wordRepository } from "../word/word.repository";
import { userRepository } from "../user/user.repository";
import { redis, touchTTL } from "../../global/config/redis.config";

class QuizService {

    private sockets = new Map<string, WebSocket>();

    attachClient(userId: string, ws: WebSocket) {
        const old = this.sockets.get(userId);
        if (old) old.close(4000, 'Reconnected');
        this.sockets.set(userId, ws);
    }

    detachClient(userId: string) {
        this.sockets.delete(userId);
    }

    async createOrResetSession(
        userId: string, 
        levels: JLPTLevel[], 
        type: PickType, 
        total: number
    ) {
        const questions = (await wordRepository.pickWords(userId, levels, type, total)).map(w => w._id.toString());
        await redis.multi()
            .del([`quiz:${userId}:meta`, `quiz:${userId}:questions`, `quiz:${userId}:correct`])
            .hSet(`quiz:${userId}:meta`, { total: String(total), currentIndex: '0', score: '0' })
            .rPush(`quiz:${userId}:questions`, shuffleArray(questions))
            .exec();
        await touchTTL(userId);
    }

    checkSession(userId: string) {
        const ws = this.sockets.get(userId);
        if (!ws) return false;
        else return true;
    }

    async sendQuestion(userId: string) {
        const ws = this.sockets.get(userId);
        if (!ws) return;

        const [idxStr] = await redis.hmGet(`quiz:${userId}:meta`, 'currentIndex');
        const wordId = await redis.lIndex(`quiz:${userId}:questions`, Number(idxStr));
        const question = await wordRepository.findById(wordId!);

        ws.send(
            JSON.stringify({ 
                type: 'quiz', 
                word: question!.word 
            })
        );
    }

    async handleAnswer(userId: string, reading: string, meaning: string) {
        const ws = this.sockets.get(userId);
        if (!ws) return;

        const [idxStr, totalStr, scoreStr] =
        await redis.hmGet(`quiz:${userId}:meta`, ['currentIndex', 'total', 'score']);
        const idx = Number(idxStr);
        const total = Number(totalStr);

        const wordId  = await redis.lIndex(`quiz:${userId}:questions`, idx);
        const q = await wordRepository.findById(wordId!);
        const correct = q!.reading === reading && q!.meaning.includes(meaning);

        const multi = redis.multi();
        if (correct) {
            multi.sAdd(`quiz:${userId}:correct`, wordId!);
            multi.hIncrBy(`quiz:${userId}:meta`, 'score', 1);
        }
        multi.hIncrBy(`quiz:${userId}:meta`, 'currentIndex', 1);
        await multi.exec();
        await touchTTL(userId);

        const newScore = correct ? Number(scoreStr) + 1 : Number(scoreStr);
        ws.send(JSON.stringify({
            type: 'result',
            correctWord: q!.word,
            correctReading: q!.reading,
            correctMeaning: q!.meaning,
            correct,
            current: idx + 1,
            total,
            score: newScore
        }));

        if (idx + 1 >= total) return this.finish(userId, ws);
        await this.sendQuestion(userId);
    }

    async finish(userId: string, ws: WebSocket) {
        const [questions, correct] = await Promise.all([
            redis.lRange(`quiz:${userId}:questions`, 0, -1),
            redis.sMembers(`quiz:${userId}:correct`)
        ]);
        const wrong = questions.filter(id => !correct.includes(id));

        await userRepository.memorize(userId, correct);
        await userRepository.unmemorize(userId, wrong);

        await redis.del([`quiz:${userId}:meta`, `quiz:${userId}:questions`, `quiz:${userId}:correct`]);
        const wrongWords = (await wordRepository.findAllByIds(wrong))
            .map(w => {
                    return {
                        word: w.word, 
                        reading: w.reading, 
                        meaning: w.meaning, 
                        level: w.level
                    }
                }
            );
        ws.send(JSON.stringify({ type: 'end', score: correct.length, total: questions.length, wrongWords: wrongWords }));
        ws.close(1000, 'finished');
        this.sockets.delete(userId);
    }

}

export const quizService = new QuizService();