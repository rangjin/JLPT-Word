import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

export let options = {
    vus: 50,
    iterations: 50
};

const BASE_URL = '';
const TOKEN = '';
const TOTAL_QUESTIONS = 50;
const LEVEL = 'JLPT1,JLPT2,JLPT3,JLPT4,JLPT5';
const PICK_TYPE = 'none';

const httpRtt = new Trend('http_rtt');

export default function () {
    const initStart = Date.now();
    const initRes = http.post(
        `${BASE_URL}/quiz/init`,
        JSON.stringify({
            total: TOTAL_QUESTIONS,
            level: LEVEL,
            pickType: PICK_TYPE,
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: TOKEN,
            },
        }
    );
    httpRtt.add(Date.now() - initStart);
    
    check(initRes, {
        'quiz/init status is 200': (r) => r.status === 200,
    });

    const uuid = initRes.json().uuid;

    let question = initRes.json().word;
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const answerStart = Date.now();
        const answerRes = http.post(
            `${BASE_URL}/quiz/answer`,
            JSON.stringify({
                uuid: uuid, 
                reading: 'dummy',
                meaning: 'dummy',
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: TOKEN,
                },
            }
        );
        httpRtt.add(Date.now() - answerStart);

        check(answerRes, {
            'quiz/answer status is 200': (r) => r.status === 200,
        });

        const json = answerRes.json();

        if (json?.result?.type === 'end') break;
        question = json?.nextQuestion?.word;
    }
}