import { WebSocket, WebSocketServer } from "ws";
import { quizService } from "./quiz.service";
import { JLPTLevel } from "../word/word.model";
import { ClientMsg } from "./quiz.dto";
import { WebSocketErrorCodes } from "../../global/errors/websocket-error-codes";
import { Server } from "http";
import { authentication } from "../../global/middlewares/auth.middleware";
import { randomUUID } from "crypto";

export function initGateway(server: Server) {
    const wss = new WebSocketServer({ noServer: true });

    server.on('upgrade', (req, socket, head) => {
        try {
            authentication(req as any, {} as any, () => {
                wss.handleUpgrade(req, socket, head, (ws) => {
                    wss.emit('connection', ws, req);
                });
            });
        } catch (err) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
        }
    })

    wss.on('connection', async (ws, req: any) => {
        const userId = req.userId
        const uuid = randomUUID();

        quizWebSocketHandler(ws, userId, uuid)
    })
}

async function quizWebSocketHandler(ws: WebSocket, userId: string, initialUuid: string) {
    let uuid = initialUuid;

    ws.on('message', async (raw) => {
        let msg: ClientMsg;

        try { 
            msg = JSON.parse(raw.toString()); 
        } catch {
            ws.send(JSON.stringify(WebSocketErrorCodes.BAD_JSON));
            return; 
        }

        switch (msg.type) {
            case 'init': {
                const total = Math.max(1, Math.min(Number(msg.total) || 30, 100));
                const levels = (msg.level as string).split(',') as JLPTLevel[];
                await quizService.createOrResetSession(userId, uuid, levels, msg.pickType, total);
                ws.send(JSON.stringify({
                    uuid: uuid, 
                    question: await quizService.sendQuestion(uuid)
                }));
                break;
            }
            case 'answer':
                const answer = await quizService.handleAnswer(uuid, msg.reading, msg.meaning);
                
                if (answer!.current >= answer!.total) {
                    ws.send(JSON.stringify({
                        answer: answer, 
                        result: await quizService.finish(userId, uuid)
                    }))
                    ws.close(1000, 'finished');
                } else {
                    ws.send(JSON.stringify({
                        answer: answer, 
                        question: await quizService.sendQuestion(uuid)
                    }))
                }
                break;
            case 'reconnect': {
                if (!await quizService.checkSession(msg.uuid)) {
                    ws.send(JSON.stringify(WebSocketErrorCodes.NEED_INIT));
                } else {
                    uuid = msg.uuid;
                    ws.send(JSON.stringify(await quizService.sendQuestion(msg.uuid)));
                }
                break;
            }
            default:
                ws.send(JSON.stringify(WebSocketErrorCodes.WRONG_TYPE));
        }
    });
}