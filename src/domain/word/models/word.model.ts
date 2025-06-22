import { Schema, model } from 'mongoose';

const wordSchema = new Schema({
  word: { type: String, required: true },
  reading: { type: String, required: true },
  meaning: { type: String, required: true },
  level: { type: String, enum: ['JLPT1', 'JLPT2', 'JLPT3', 'JLPT4', 'JLPT5'], required: true }
}, { timestamps: true });

export const Word = model('Word', wordSchema);