process.env.NODE_ENV = process.env.NODE_ENV || 'development';
import 'dotenv/config';
import { startMediasoup } from './client/mediasoup';
import { startRabbit } from './client/rabbitmq';
import serverConfig from './config/server';
import { rooms } from './helper/MyRoomState';
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

// setInterval(() => {
//   let totalProducers = 0;
//   let totalConsumers = 0;
//   let totalState = 0;
//   if (Object.keys(rooms).length > 0) {
//     Object.keys(rooms).forEach((room) => {
//       Object.entries(rooms[room].state).forEach(([, value]) => {
//         totalProducers += value.producers?.length ?? 0;
//         totalConsumers += value.producers?.length ?? 0;
//       });
//       totalState += Object.keys(rooms[room].state).length;
//     });
//   }
//   log.info(
//     'Total : ',
//     Object.keys(rooms).length,
//     'Producers : ',
//     totalProducers,
//     'Consumers : ',
//     totalConsumers,
//     'State : ',
//     totalState
//   );
// }, 1000);

setInterval(() => {
  Object.entries(rooms).forEach(([_roomId, room]) => {
    Object.entries(room.state).forEach(([userId, value]) => {
      log.debug(
        "User's state : ",
        userId,
        value.producers.map((producer) => producer.id)
      );
    });
  });
}, 2000);

main().catch((err) => {
  log.error(err, 'Restarting panchayat server');
  process.exit(1);
});
