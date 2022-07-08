process.env.NODE_ENV = process.env.NODE_ENV || 'development';
import 'dotenv/config';
import { startMediasoup } from './client/mediasoup';
import { startRabbit } from './client/rabbitmq';
import serverConfig from './config/server';
import { addMeInRedis, getMe } from './helper/redis';
import Logger from './utils/logger';
const log = new Logger();

async function main() {
  // create worker and router for mediasoup server
  await startMediasoup();
  await startRabbit();

  // add this server in mediasoup server
  await addMeInRedis(
    { consumerId: '123', producerId: '123', rooms: ['123'], routerId: '123' },
    serverConfig.WORKER_ID
  );
  const serverId = await getMe();
  log.info(`Starting panchayat server with ${serverId}`);
}
main().catch((err) => {
  log.error(err, 'Restarting panchayat server');
  process.exit(1);
});
