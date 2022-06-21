import { Channel } from 'amqplib';
import { ROOM_EXCHANGE } from '../../utils/constants';

export const createExchanges = async (channel: Channel) => {
  await channel.assertExchange(ROOM_EXCHANGE, 'direct');
};
