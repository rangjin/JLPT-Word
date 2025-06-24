import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomException } from "../../global/errors/custom-exception";
import { ErrorCodes } from "../../global/errors/error-codes";
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../global/config/jwt.config';
import { userRepository } from './user.repository';
import { wordRepository } from '../word/word.repository';
import { Types } from 'mongoose';

class UserService {

    async signup(email: string, password: string) {
        if (await userRepository.findByEmailorNull(email)) 
            throw new CustomException(ErrorCodes.EMAIL_ALREADY_EXISTS);
    
        return await userRepository.save(email, await bcrypt.hash(password, 10));
    }

    async login(email: string, password: string) {
        const user = await userRepository.findByEmailorNull(email);
        console.log(user);
        if (!user || !(await bcrypt.compare(password, user.password!))) 
            throw new CustomException(ErrorCodes.INVALID_CREDENTIALS)
    
        return {
            token: jwt.sign({ userId: user._id, userRole: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
        };
    }

    async memorize(userId: string, words: string[]) {
        const existingWords = await wordRepository.findExistingWords(words);
        await userRepository.memorize(userId, existingWords.map(w => w._id) as Types.ObjectId[]);
        return {
            memorizedWords: existingWords
        }
    }

    async unmemorize(userId: string, words: string[]) {
        const existingWords = await wordRepository.findExistingWords(words);
        const result = await userRepository.unmemorize(userId, existingWords.map(w => w._id) as Types.ObjectId[]);
        return {
            unmemorizedWords: existingWords
        }
    }

}

export const userService = new UserService();