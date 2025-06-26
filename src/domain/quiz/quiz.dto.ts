import { PickType } from "../word/word.repository";

export interface ClientAuthMsg { 
    type: 'auth'; 
    token: string; 
}

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

export interface RestartMsg { 
    type: 'restart'; 
    total?: number; 
    level: string;
    pickType: PickType
}

export interface ReconnectMsg {
    type: 'reconnect';
}

export type ClientMsg = ClientAuthMsg | InitMsg | AnswerMsg | RestartMsg | ReconnectMsg;