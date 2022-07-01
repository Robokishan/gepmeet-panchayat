import { rabbitMQChannel } from '../../client/rabbitmq';
import serverConfig from '../../config/server';
import { MONITOR_EXCHANGE } from '../constants';

export const sendMessageToMonitorQueue = (msg: any) => {
  rabbitMQChannel.publish(
    MONITOR_EXCHANGE,
    serverConfig.WORKER_ID,
    Buffer.from(JSON.stringify(msg)),
    {
      expiration: 1000
    }
  );
};
