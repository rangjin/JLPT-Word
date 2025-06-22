import { IWord, JLPTLevel, Word } from "./word.model";

class WordRepository {

    async findAllByWordAndLevel(words: {
        word: string, 
        level: JLPTLevel
    }[]): Promise<IWord[]> {
        return await Word.find({
            $or: words
        });
    }

    async saveAll(words: {
        word: string;
        reading: string;
        meaning: string;
        level: JLPTLevel;
    }[]): Promise<IWord[]> {
        return await Word.insertMany(words, { ordered: false });
    }

}

export const wordRepository = new WordRepository();