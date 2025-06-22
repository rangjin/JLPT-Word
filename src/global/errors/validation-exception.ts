import { CustomException } from "./custom-exception";
import { ErrorCode } from "./error-codes";

export class ValidationException extends CustomException {
    public readonly errors: { type: string, msg: string }[];

    constructor(errorCode: ErrorCode, errors: { type: string, msg: string }[]) {
        super(errorCode);
        this.errors = errors;
    }
}