import { IWord, JLPTLevel } from "./word.model";
import { wordRepository } from "./word.repository";
import { shuffleArray } from '../../global/utils/shuffle.util';
import { generatePdf } from '../../global/utils/pdf.util';

class WordService {

    async createWords (words: {
        word: string;
        reading: string;
        meaning: string;
        level: JLPTLevel;
    }[]) {
        const existingWords = (await wordRepository.findExistingWords(
            words.map(w => ({ word: w.word }))
        )).map(w => w.word);

        const existingSet = new Set(existingWords);

        const newWords = words.filter(w => {
            const key = `${w.word}`;
            return !existingSet.has(key);
        });

        const savedWords = await wordRepository.saveAll(newWords);

        const result = {
            savedWords: savedWords, 
            existingWords: existingWords
        }

        return result;
    }

    async getPdf(levels: JLPTLevel[], type: string, userId: string) {
        let words: IWord[];

        if (type === 'memorized') {
            words = await wordRepository.findMemorizedWords(userId, levels);
        } else if (type === 'unmemorized') {
            words = await wordRepository.findUnmemorizedWords(userId, levels);
        } else {
            words = await wordRepository.findAllByLevels(levels);
        }
        
        const shuffleWords = shuffleArray(words);

        return generatePdf(shuffleWords);
    }

}

export const wordService = new WordService();