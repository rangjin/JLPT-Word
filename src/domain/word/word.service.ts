import { JLPTLevel } from "./word.model";
import { PickType, wordRepository } from "./word.repository";
import { shuffleArray } from '../../global/utils/shuffle.util';
import { generatePdfStream } from '../../global/utils/pdf.util';
import { CustomException } from "../../global/errors/custom-exception";
import { ErrorCodes } from "../../global/errors/error-codes";

class WordService {

    async createWords (words: {
        word: string;
        reading: string;
        meaning: string;
        level: JLPTLevel;
    }[]) {
        const existingWords = (await wordRepository.findExistingWords(
            words.map(w => w.word)
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

    async getPdfStream(levels: JLPTLevel[], type: PickType, userId: string) {
        const words = await wordRepository.pickWords(userId, levels, type, null);
        const shuffleWords = shuffleArray(words);

        try {
            return generatePdfStream(shuffleWords);
        } catch (_) {
            throw new CustomException(ErrorCodes.PDF_GENERATION_FAILED)
        }
    }

}

export const wordService = new WordService();