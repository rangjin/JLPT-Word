import { body } from "express-validator";

export const authenticationValidator = [
    body('email')
        .notEmpty().withMessage('이메일은 비어 있을 수 없습니다.')
        .isEmail().withMessage('유효한 이메일 형식이 아닙니다.'),

    body('password')
        .notEmpty().withMessage('비밀번호는 비어 있을 수 없습니다.')
        .isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
];