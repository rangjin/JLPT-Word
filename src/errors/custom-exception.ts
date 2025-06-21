import { ErrorCode } from './error-code';

export class CustomException extends Error {
    public readonly status: number;

    constructor(errorCode: ErrorCode) {
        super(errorCode.message);
        this.status = errorCode.status;
    }
}