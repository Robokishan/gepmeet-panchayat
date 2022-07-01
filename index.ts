process.env.NODE_ENV = process.env.NODE_ENV || 'development';
import 'dotenv/config';
import { startMediasoup } from './client/mediasoup';
import { startRabbitServer } from './client/rabbitmq/startRabbit';
import serverConfig from './config/server';
import { addMeInRedis, getMe } from './helper/redis';
import { createScheduler } from './helper/Scheduler';
import Logger from './utils/logger';

async function main() {
  // Create server
  const log = new Logger();

  // create worker and router for mediasoup server
  await startMediasoup();
  await startRabbitServer();
  await createScheduler();

  // add this server in mediasoup server
  await addMeInRedis(
    { consumerId: '123', producerId: '123', rooms: ['123'], routerId: '123' },
    serverConfig.WORKER_ID
  );
  const serverId = await getMe();
  log.info(`Starting panchayat server with ${serverId}`);
}
main();
