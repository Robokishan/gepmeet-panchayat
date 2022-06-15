export const __prod__ = process.env.NODE_ENV === 'production';
export const panchayatHandshakqQueue = `panchayat:handshake:${process.env.WORKER_ID}`;
