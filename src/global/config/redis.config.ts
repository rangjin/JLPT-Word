import { createClient } from 'redis';

export const redis = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!, 10)
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