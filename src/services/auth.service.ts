import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.config';
import { CustomException } from '../errors/custom-exception';
import { ErrorCodes } from '../errors/error-code';

const signup = async (email: string, password: string, name?: string) => {
    if (await User.findOne({ email })) 
        throw new CustomException(ErrorCodes.EMAIL_ALREADY_EXISTS);

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, name });
    await user.save();

    return { status: 201, body: { message: '회원가입 완료' } };
};

const login = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password!))) 
        throw new CustomException(ErrorCodes.INVALID_CREDENTIALS)

    const token = jwt.sign({ userId: user._id, userRole: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { status: 200, body: { token } };
};

export { signup, login };