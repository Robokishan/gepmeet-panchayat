import { Channel } from 'amqplib';
import serverConfig from '../../config/server';
import {
  MONITOR_EXCHANGE,
  panchayatMonitorQueue,
  QUEUE_ROOM_EVENTS,
  ROOM_EXCHANGE
} from './constants';

export const createQueues = async (channel: Channel) => {
  await channel.assertQueue(QUEUE_ROOM_EVENTS, {
    // durable: false
  });
  await channel.assertQueue(panchayatMonitorQueue, {
    // durable: false
  });
};

export const createExchanges = async (channel: Channel) => {
  await channel.assertExchange(ROOM_EXCHANGE, 'direct', {
    autoDelete: true
  });
  await channel.assertExchange(MONITOR_EXCHANGE, 'direct', {
    autoDelete: true
  });
  await bindQueues(channel);
};

export const bindQueues = async (channel: Channel) => {
  await channel.bindQueue(
    panchayatMonitorQueue,
    MONITOR_EXCHANGE,
    serverConfig.WORKER_ID
  );
};
