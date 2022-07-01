import Redis, { RedisOptions } from 'ioredis';
import serverConfig from '../../config/server';

const redisConfig: RedisOptions = {
  host: serverConfig.REDIS_HOST,
  port: Number(serverConfig.REDIS_PORT),
  username: serverConfig.REDIS_USERNAME,
  password: serverConfig.REDIS_PASSWORD,
  maxRetriesPerRequest: null
};

const redis = new Redis(redisConfig);
export default redis;
