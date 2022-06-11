import redis from '../../client/redis';
import serverConfig from '../../config/server';
import { HASH_KEY, SET_KEY } from '../../utils/constants/redis';
import Logger from '../../utils/logger';
import { MetaDataType } from './types';

const log = new Logger();

const SETS_WORKER = `${SET_KEY}:IDS`;
const HASH_WORKER_KEY = `${HASH_KEY}:${serverConfig.WORKER_ID}`;

export const getMe = async () => {
  return await redis.hget(HASH_WORKER_KEY, 'workerId');
};

export const addMeInRedis = async (data: MetaDataType, workerId: string) => {
  await redis.sadd(SETS_WORKER, serverConfig.WORKER_ID);
  await redis.hmset(HASH_WORKER_KEY, {
    workerId
  });
  await upsertMyMetadata(data);
};

export const deleteMeFromredis = async () => {
  let status = null;
  status = await redis.srem(SETS_WORKER, serverConfig.WORKER_ID);
  log.info(status);
  status = await redis.del(HASH_WORKER_KEY);
  log.info(status);
};

export const unregistermeFromRoom = async () => {
  // delete me from room list
};

export const upsertMyMetadata = async (metadata: MetaDataType) => {
  log.info('writing ', metadata);
  return await redis.hmset(HASH_WORKER_KEY, metadata);
};
