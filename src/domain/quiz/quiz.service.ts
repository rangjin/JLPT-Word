import { WebSocket } from "ws";
import { shuffleArray } from "../../global/utils/shuffle.util";
import { IWord, JLPTLevel } from "../word/word.model";
import { PickType, wordRepository } from "../word/word.repository";
import { userRepository } from "../user/user.repository";

interface QuizSession {
    ws: WebSocket;
    questions: string[];
    correctWord: string[];
    currentIndex: number;
    score: number;
    total: number;
}

class QuizService {

    private sessions: Map<String, QuizSession> = new Map();
    
    attachClient(userId: string, ws: WebSocket) {
        let session = this.sessions.get(userId);
        if (!session) {
            session = {
                ws: ws, 
                questions: [], 
                correctWord: [], 
                currentIndex: 0, 
                score: 0, 
                total: 0
            };
            this.sessions.set(userId, session);
        }
        session.ws = ws;
    }

    detachClient(userId: string) {
        const session = this.sessions.get(userId);
        if (!session) return;
        else session.ws = null as unknown as WebSocket;
    }

    async createOrResetSession(
        userId: string, 
        levels: JLPTLevel[], 
        type: PickType, 
        total: number
    ) {
        const session = this.sessions.get(userId);
        if (!session) return;

        const questions = (await wordRepository.pickWords(userId, levels, type, total)).map(w => w._id.toString());
        session.questions = shuffleArray(questions) as string[];
        session.currentIndex = 0;
        session.score = 0;
        session.total = total;
    }

    async handleAnswer(userId: string, reading: string, meaning: string) {
        const session = this.sessions.get(userId);
        if (!session) return;

        const question = (await wordRepository.findById(session.questions[session.currentIndex]))!;
        const correct = question.reading === reading && question.meaning.includes(meaning);
        if (correct) {
            session.score++;
            session.correctWord.push(question._id.toString());
        }

        session.ws.send(
            JSON.stringify({
                type: 'result', 
                correctWord: question.word, 
                correctReading: question.reading, 
                correctMeaning: question.meaning,
                correct: correct, 
                current: session.currentIndex + 1, 
                total: session.total, 
                score: session.score
            })
        );

        session.currentIndex++;
        if (session.currentIndex >= session.total) {
            const wrongWord: string[] = session.questions.filter(
                id => !session.correctWord.includes(id)
            );
            await userRepository.memorize(userId, session.correctWord);
            await userRepository.unmemorize(userId, wrongWord);
            session.ws.send(
                JSON.stringify({ 
                    type: 'end', 
                    score: session.score, 
                    total: session.total, 
                })
            );
            this.sessions.delete(userId);
            session.ws.close(1000, "finished");
            return;
        }
        await this.sendQuestion(userId);
    }

    async sendQuestion(userId: string) {
        const session = this.sessions.get(userId);
        if (!session) return;
        
        const question: IWord = (await wordRepository.findById(session.questions[session.currentIndex]))!;
        session.ws.send(
            JSON.stringify({ 
                type: 'quiz', 
                word: question.word 
            })
        );
    }

}

export const quizService = new QuizService();