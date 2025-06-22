import { body } from "express-validator";

export const createWordsValidator = [
    body('words')
        .isArray({ min: 1 }).withMessage('words는 비어 있지 않은 배열이어야 합니다.'), 
    
    body('words.*.word')
        .isString().withMessage('일본어 단어는 문자열이어야 합니다.')
        .notEmpty().withMessage('일본어 단어는 비어 있을 수 없습니다.'),

    body('words.*.reading')
        .isString().withMessage('뜻은 문자열이어야 합니다.')
        .notEmpty().withMessage('뜻은 비어 있을 수 없습니다.'),

    body('words.*.meaning')
        .isString().withMessage('발음은 문자열이어야 합니다.')
        .notEmpty().withMessage('발음은 비어 있을 수 없습니다.'),

    body('words.*.level')
        .isIn(['JLPT1', 'JLPT2', 'JLPT3', 'JLPT4', 'JLPT5'])
        .withMessage('level은 JLPT1~JLPT5 중 하나여야 합니다.')
];