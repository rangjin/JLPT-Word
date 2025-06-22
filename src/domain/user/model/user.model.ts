import { Schema, model } from "mongoose";

const userSchema = new Schema({
    email: { type: String, require: true, unique: true }, 
    password: { type: String, require: true }, 
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, 
    memorizedWordIds: [{ type: Schema.Types.ObjectId, ref: 'Word' }]
}, { timestamps: true });

export const User = model('User', userSchema);