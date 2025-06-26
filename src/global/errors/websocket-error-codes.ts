export const WebSocketErrorCodes = {
    BAD_JSON: { message: '잘못된 JSON 양식입니다.' }, 
    UNAUTHORIZED: { message: '인증이 필요합니다.' }, 
    INVALID_TOKEN: { message: '잘못된 토큰입니다.' }, 
    WRONG_TYPE: { message: '잘못된 타입입니다.' }
} as const;

export type WebSocketErrorCode = typeof WebSocketErrorCodes[keyof typeof WebSocketErrorCodes];