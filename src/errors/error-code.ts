export const ErrorCodes = {
    EMAIL_ALREADY_EXISTS: { status: 400, message: '이미 가입된 이메일입니다.' },
    INVALID_CREDENTIALS: { status: 401, message: '이메일 또는 비밀번호가 틀렸습니다.' },
    UNAUTHORIZED: { status: 401, message: '인증이 필요합니다.' },
    INTERNAL_SERVER_ERROR: { status: 500, message: '서버 오류가 발생했습니다.' }
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];