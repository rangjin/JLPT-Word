import { User } from '../model/user.model';

class UserRepository {

    async save(email: string, password: string) {
        return await new User({ email, password }).save();
    }

    async findByEmail(email: String) {
        return await User.findOne({ email });
    }

}

export const userRepository = new UserRepository();