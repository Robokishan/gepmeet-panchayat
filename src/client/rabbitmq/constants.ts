import serverConfig from '../../config/server';

export const panchayatHandshakqQueue = `panchayat:handshake:${serverConfig.WORKER_ID}`;
export const panchayatRPCServerExchange = `panchayat:handshake:exchange`;
export const ROOM_EXCHANGE = 'roomexchange';
export const MONITOR_EXCHANGE = 'MONITOR_EXCHANGE';
export const QUEUE_ROOM_EVENTS = 'roomeventsQueue';
export const panchayatMonitorQueue = `panchayat:monitor`;
