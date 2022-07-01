import { Channel } from 'amqplib';
import serverConfig from '../../config/server';
import {
  MONITOR_EXCHANGE,
  panchayatMonitorQueue,
  ROOM_EXCHANGE
} from '../../utils/constants/queue';

export const createExchanges = async (channel: Channel) => {
  await channel.assertExchange(ROOM_EXCHANGE, 'direct');
  await channel.assertExchange(MONITOR_EXCHANGE, 'direct');
  await bindQueues(channel);
};

export const bindQueues = async (channel: Channel) => {
  await channel.bindQueue(
    panchayatMonitorQueue,
    MONITOR_EXCHANGE,
    serverConfig.WORKER_ID
  );
};
