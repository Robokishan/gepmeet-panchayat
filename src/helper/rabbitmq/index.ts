import { rabbitMQChannel } from '../../client/rabbitmq';
import serverConfig from '../../config/server';
import { MONITOR_EXCHANGE, ROOM_EXCHANGE } from '../../utils/constants/queue';
import { getRoomKey } from '../../utils/room';

export const sendMessageToMonitorQueue = (msg: unknown) => {
  rabbitMQChannel.publish(
    MONITOR_EXCHANGE,
    serverConfig.WORKER_ID,
    Buffer.from(JSON.stringify(msg)),
    {
      expiration: serverConfig.MONITOR_POLL_INTERVAL
    }
  );
};

export const sendMessageToRoomQueue = (roomId: string, msg: unknown) => {
  rabbitMQChannel.publish(
    ROOM_EXCHANGE,
    getRoomKey(roomId),
    Buffer.from(JSON.stringify(msg))
  );
};
