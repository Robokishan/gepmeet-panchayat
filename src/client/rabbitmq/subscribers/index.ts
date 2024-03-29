import { rabbitMQChannel } from '..';
import { QUEUE_ROOM_EVENTS, ROOM_EXCHANGE } from '../../../utils/constants/queue';
import { onRoomEvents } from './events';

const getRoomKey = (roomId: string) => `roomIdExchange:${roomId}`;

export const startRoomSubscribers = async (roomId: string) => {
  await rabbitMQChannel.bindQueue(
    QUEUE_ROOM_EVENTS,
    ROOM_EXCHANGE,
    getRoomKey(roomId)
  );
  await rabbitMQChannel.consume(QUEUE_ROOM_EVENTS, onRoomEvents);
};

export const stopRoomSubscribers = async (roomId: string) => {
  await rabbitMQChannel.unbindQueue(
    QUEUE_ROOM_EVENTS,
    ROOM_EXCHANGE,
    getRoomKey(roomId)
  );
};
