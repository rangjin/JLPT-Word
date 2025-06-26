import { Schema, Document, model } from 'mongoose';

export type JLPTLevel = 'JLPT1' | 'JLPT2' | 'JLPT3' | 'JLPT4' | 'JLPT5';

export interface IWord extends Document {
    _id: string, 
    word: string;
    reading: string;
    meaning: string;
    level: JLPTLevel;
    createdAt: Date;
    updatedAt: Date;
}

const wordSchema = new Schema<IWord>({
    word: { type: String, required: true },
    reading: { type: String, required: true },
    meaning: { type: String, required: true },
    level: { type: String, enum: ['JLPT1', 'JLPT2', 'JLPT3', 'JLPT4', 'JLPT5'], required: true }
}, { timestamps: true });

export const Word = model<IWord>('Word', wordSchema);