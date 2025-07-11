import { PickType } from "../word/word.repository";

export interface InitMsg { 
    type: 'init'; 
    total?: number; 
    level: string;
    pickType: PickType
}

export interface AnswerMsg {
    type: 'answer'; 
    reading: string;
    meaning: string; 
}

export interface ReconnectMsg {
    type: 'reconnect';
    uuid: string;
}

export type ClientMsg = InitMsg | AnswerMsg | ReconnectMsg;