export const ErrorCodes = {
    VALIDATION_ERROR: { status: 400, message: '입력값 검증에 실패했습니다.' }, 
    EMAIL_ALREADY_EXISTS: { status: 400, message: '이미 가입된 이메일입니다.' },
    INVALID_CREDENTIALS: { status: 401, message: '이메일 또는 비밀번호가 틀렸습니다.' },
    UNAUTHORIZED: { status: 401, message: '인증이 필요합니다.' },
    INVALID_TOKEN: { status: 401, message: '잘못된 인증 토큰입니다.' },
    FORBIDDEN: { status: 403, message: '관리자만 접근 가능합니다.' },
    PDF_GENERATION_FAILED: { status: 400, message: 'PDF 생성에 실패하였습니다.' }, 
    INTERNAL_SERVER_ERROR: { status: 500, message: '서버 오류가 발생했습니다.' }
    
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];