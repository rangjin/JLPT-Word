import { User } from "../user/user.model";
import { IWord, JLPTLevel, Word } from "./word.model";

class WordRepository {

    async findExistingWords(words: string[]): Promise<IWord[]> {
        return await Word.find({
            word: { $in: words }
        });
    }

    async findAllByLevels(levels: JLPTLevel[]): Promise<IWord[]> {
        return await Word.find({ level: { $in: levels } });
    }

    async findMemorizedWords(userId: string, levels: JLPTLevel[]): Promise<IWord[]> {
        const user = await User.findById(userId).select('memorizedWordIds');
        return await Word.find({
            _id: { $in: user!.memorizedWordIds },
            level: { $in: levels }
        });
    }

    async findUnmemorizedWords(userId: string, levels: JLPTLevel[]): Promise<IWord[]> {
        const user = await User.findById(userId).select('memorizedWordIds');
        return await Word.find({
            _id: { $nin: user!.memorizedWordIds },
            level: { $in: levels }
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