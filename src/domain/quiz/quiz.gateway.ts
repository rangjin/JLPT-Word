import { WebSocket, WebSocketServer } from "ws";
import { quizService } from "./quiz.service";
import { JLPTLevel } from "../word/word.model";
import { ClientMsg } from "./quiz.dto";
import { WebSocketErrorCodes } from "../../global/errors/websocket-error-codes";
import { Server } from "http";
import { authentication } from "../../global/middlewares/auth.middleware";

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

    wss.on('connection', async (ws, req) => {
        quizWebSocketHandler(ws, req)
    })
}

async function quizWebSocketHandler(ws: WebSocket, req: any) {
    const userId = req.userId

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
                quizService.attachClient(userId, ws);
                const total = Math.max(1, Math.min(Number(msg.total) || 30, 100));
                const levels = (msg.level as string).split(',') as JLPTLevel[];
                await quizService.createOrResetSession(userId, levels, msg.pickType, total);
                await quizService.sendQuestion(userId);
                break;
            }
            case 'answer':
                await quizService.handleAnswer(userId, msg.reading, msg.meaning);
                break;
            case 'reconnect': {
                if (!quizService.checkSession(userId)) {
                    ws.send(JSON.stringify(WebSocketErrorCodes.NEED_INIT));
                } else {
                    await quizService.sendQuestion(userId);
                }
                break;
            }
            default:
                ws.send(JSON.stringify(WebSocketErrorCodes.WRONG_TYPE));
        }
    });

    ws.on('close', () => {
        if (userId) quizService.detachClient(userId);
    });

}