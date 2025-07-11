import ws from 'k6/ws';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

export let options = {
    vus: 50,
    iterations: 50,
};

const BASE_URL = '';
const TOKEN = '';
const TOTAL_QUESTIONS = 50;
const LEVEL = 'JLPT1,JLPT2,JLPT3,JLPT4,JLPT5';
const PICK_TYPE = 'none';

const wsRtt = new Trend('ws_rtt');

export default function () {
    const param = {
        headers: {
            Authorization: TOKEN
        }
    }

    const res = ws.connect(BASE_URL, param, (socket) => {
        let receivedCount = 0;
        let sendTime = Date.now();

        socket.on('open', () => {
            socket.send(JSON.stringify({
                type: "init", 
                total: TOTAL_QUESTIONS,
                level: LEVEL,
                pickType: PICK_TYPE,
            }));
        });

        socket.on('message', (msg) => {
            wsRtt.add(Date.now() - sendTime);

            check(msg, { 'msg received': (m) => m && m.length > 0 });

            receivedCount++;
            if (receivedCount >= TOTAL_QUESTIONS + 1) {
                socket.close();
            }
            sendTime = Date.now();
            socket.send(JSON.stringify({
                type: "answer",
                reading: "dummy",
                meaning: "dummy",
            }));

        });
    });

    check(res, { 'ws connected': (r) => r && r.status === 101});
}