import { Channel } from 'amqplib';
import {
  panchayatMonitorQueue,
  QUEUE_ROOM_EVENTS
} from '../../utils/constants/queue';

export const createQueues = async (channel: Channel) => {
  await channel.assertQueue(QUEUE_ROOM_EVENTS, {
    // durable: false
  });
  await channel.assertQueue(panchayatMonitorQueue, {
    // durable: false
  });
};
