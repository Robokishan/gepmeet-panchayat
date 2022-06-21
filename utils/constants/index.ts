export const __prod__ = process.env.NODE_ENV === 'production';
export const panchayatHandshakqQueue = `panchayat:handshake:${process.env.WORKER_ID}`;
export const ROOM_EXCHANGE = 'roomexchange';
export const QUEUE_ROOM_EVENTS = 'roomeventsQueue';
