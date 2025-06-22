import { IUser, User } from '../model/user.model';

class UserRepository {

    async save(email: string, password: string): Promise<IUser> {
        return await new User({ email, password }).save();
    }

    async findByEmailorNull(email: String): Promise<IUser | null> {
        return await User.findOne({ email });
    }

}

export const userRepository = new UserRepository();