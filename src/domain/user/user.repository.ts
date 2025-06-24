import { ObjectId, Types } from 'mongoose';
import { IUser, User } from './user.model';

class UserRepository {

    async save(email: string, password: string): Promise<IUser> {
        return await new User({ email, password }).save();
    }

    async findByEmailorNull(email: String): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async memorize(userId: string, wordIds: Types.ObjectId[]) {
        return await User.updateOne(
            { _id: userId }, 
            {
                $addToSet: {
                    memorizedWordIds: {
                        $each: wordIds
                    }
                }
            }
        )
    }

    async unmemorize(userId: string, wordIds: Types.ObjectId[]) {
        return await User.updateOne(
            { _id: userId }, 
            {
                $pull: {
                    memorizedWordIds: {
                        $in: wordIds
                    }
                }
            }
        )
    }

}

export const userRepository = new UserRepository();