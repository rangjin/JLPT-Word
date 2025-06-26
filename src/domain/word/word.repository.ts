import { Types } from "mongoose";
import { User } from "../user/user.model";
import { IWord, JLPTLevel, Word } from "./word.model";

export type PickType = 'memorized' | 'unmemorized' | 'none';

class WordRepository {

    async pickWords(
        userId: string,
        levels: JLPTLevel[],
        type: PickType,
        total: number | null = null
    ): Promise<IWord[]> {
        const match: any = { level: { $in: levels } };
        
        if (type !== 'none') {
            const user = await User.findById(userId).select('memorizedWordIds');
            const ids = user?.memorizedWordIds ?? [];

            match._id = type === 'memorized' ? { $in: ids } : { $nin: ids };
        }

        if (!total) {
            return await Word.find(match);
        }

        return await Word.aggregate([
            { $match: match },
            { $sample: { size: total! } }
        ]);
    }

    async findExistingWords(words: string[]): Promise<IWord[]> {
        return await Word.find({
            word: { $in: words }
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

    async findById(id: string) {
        return await Word.findById(id);
    }

}

export const wordRepository = new WordRepository();