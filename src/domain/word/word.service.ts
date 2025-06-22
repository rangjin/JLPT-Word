import { JLPTLevel } from "./word.model";
import { wordRepository } from "./word.repository";

class WordService {

    async createWords (words: {
        word: string;
        reading: string;
        meaning: string;
        level: JLPTLevel;
    }[]) {
        const existingWords = await wordRepository.findExistingWords(
            words.map(w => ({ word: w.word, level: w.level }))
        );
    
        const existingSet = new Set(
            existingWords.map(w => `${w.word}-${w.level}`)
        );

        const newWords = words.filter(w => {
            const key = `${w.word}-${w.level}`;
            return !existingSet.has(key);
        });

        if (newWords.length === 0) return [];

        return await wordRepository.saveAll(newWords);
    }

}

export const wordService = new WordService();