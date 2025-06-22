import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomException } from "../../../global/errors/custom-exception";
import { ErrorCodes } from "../../../global/errors/error-codes";
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../../global/config/jwt.config';
import { userRepository } from '../repository/user.repository';

class AuthService {

    async signup (email: string, password: string) {
        if (await userRepository.findByEmail(email)) 
            throw new CustomException(ErrorCodes.EMAIL_ALREADY_EXISTS);
    
        const result = await userRepository.save(email, await bcrypt.hash(password, 10));
        console.log(result);
    
        return { status: 201, body: { message: '회원가입 완료' } };
    }

    async login (email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        console.log(user);
        if (!user || !(await bcrypt.compare(password, user.password!))) 
            throw new CustomException(ErrorCodes.INVALID_CREDENTIALS)
    
        const token = jwt.sign({ userId: user._id, userRole: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
        return { status: 200, body: { token } };
    }

}

export const authService = new AuthService();