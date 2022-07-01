import { Channel } from 'amqplib';
import { panchayatMonitorQueue, QUEUE_ROOM_EVENTS } from '../../utils/constants';

export const createQueues = async (channel: Channel) => {
  await channel.assertQueue(QUEUE_ROOM_EVENTS);
  await channel.assertQueue(panchayatMonitorQueue)
};
