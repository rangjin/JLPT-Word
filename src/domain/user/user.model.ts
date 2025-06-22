import { Schema, Document, Types, model } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    role: 'admin' | 'user';
    memorizedWordIds: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    email: { type: String, require: true, unique: true }, 
    password: { type: String, require: true }, 
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, 
    memorizedWordIds: [{ type: Schema.Types.ObjectId, ref: 'Word' }]
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);