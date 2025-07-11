import { shuffleArray } from "../../global/utils/shuffle.util";
import { JLPTLevel } from "../word/word.model";
import { PickType, wordRepository } from "../word/word.repository";
import { userRepository } from "../user/user.repository";
import { redis, touchTTL } from "../../global/config/redis.config";

class QuizService {

    async createOrResetSession(
        userId: string, 
        uuid: string, 
        levels: JLPTLevel[], 
        type: PickType, 
        total: number
    ) {
        const questions = (await wordRepository.pickWords(userId, levels, type, total)).map(w => w._id.toString());
        await redis.multi()
            .del([`quiz:${uuid}:meta`, `quiz:${uuid}:questions`, `quiz:${uuid}:correct`])
            .hSet(`quiz:${uuid}:meta`, { total: String(total), currentIndex: '0', score: '0' })
            .rPush(`quiz:${uuid}:questions`, shuffleArray(questions))
            .exec();
        await touchTTL(uuid);
    }

    async checkSession(userId: string) {
        return await redis.exists(`quiz:${userId}:meta`);
    }

    async sendQuestion(uuid: string) {
        const [idxStr] = await redis.hmGet(`quiz:${uuid}:meta`, 'currentIndex');
        const wordId = await redis.lIndex(`quiz:${uuid}:questions`, Number(idxStr));
        const question = await wordRepository.findById(wordId!);
        return { 
            type: 'quiz', 
            word: question!.word 
        };
    }

    async handleAnswer(uuid: string, reading: string, meaning: string) {
        const [idxStr, totalStr, scoreStr] =
        await redis.hmGet(`quiz:${uuid}:meta`, ['currentIndex', 'total', 'score']);
        const idx = Number(idxStr);
        const total = Number(totalStr);

        const wordId  = await redis.lIndex(`quiz:${uuid}:questions`, idx);
        const q = await wordRepository.findById(wordId!);
        const correct = q!.reading === reading && q!.meaning.includes(meaning);

        const multi = redis.multi();
        if (correct) {
            multi.sAdd(`quiz:${uuid}:correct`, wordId!);
            multi.hIncrBy(`quiz:${uuid}:meta`, 'score', 1);
        }
        multi.hIncrBy(`quiz:${uuid}:meta`, 'currentIndex', 1);
        await multi.exec();
        await touchTTL(uuid);

        const newScore = correct ? Number(scoreStr) + 1 : Number(scoreStr);
        return {
            type: 'result',
            correctWord: q!.word,
            correctReading: q!.reading,
            correctMeaning: q!.meaning,
            correct,
            current: idx + 1,
            total,
            score: newScore
        };
    }

    async finish(userId: string, uuid: string) {
        const [questions, correct] = await Promise.all([
            redis.lRange(`quiz:${uuid}:questions`, 0, -1),
            redis.sMembers(`quiz:${uuid}:correct`)
        ]);
        const wrong = questions.filter(id => !correct.includes(id));

        await userRepository.memorize(userId, correct);
        await userRepository.unmemorize(userId, wrong);

        await redis.del([`quiz:${uuid}:meta`, `quiz:${uuid}:questions`, `quiz:${uuid}:correct`]);
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

        return { 
            type: 'end', 
            score: correct.length, 
            total: questions.length, 
            wrongWords: wrongWords 
        };
    }

}

export const quizService = new QuizService();