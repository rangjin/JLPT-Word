import { createClient } from 'redis';

export const redis = createClient({
    username: 'default',
    password: 'gmxabWbR0aQddoJaygf6xZ2t6W70x83d',
    socket: {
        host: 'redis-16465.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com',
        port: 16465
    }
});

redis.on('error', err => console.log('Redis Client Error', err));

export const connectRedis = async () => {
    try {
        await redis.connect();
        console.log('Redis Connected');
    } catch (e) {
        console.error('Redis Connection Failed', e);
        process.exit(1);
    }
};

const TTL_SEC = 600;
export function touchTTL(userId: string) {
    return Promise.all([
        redis.expire(`game:${userId}:meta`, TTL_SEC),
        redis.expire(`game:${userId}:correct`, TTL_SEC),
        redis.expire(`game:${userId}:ids`, TTL_SEC)
    ]);
}