import serverConfig from '../../config/server';

export const __prod__ = process.env.NODE_ENV === 'production';
export const panchayatHandshakqQueue = `panchayat:handshake:${serverConfig.WORKER_ID}`;
export const ROOM_EXCHANGE = 'roomexchange';
export const MONITOR_EXCHANGE = 'MONITOR_EXCHANGE';
export const QUEUE_ROOM_EVENTS = 'roomeventsQueue';
export const panchayatMonitorQueue = `panchayat:monitor`;
