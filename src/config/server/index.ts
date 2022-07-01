import Logger from '../../utils/logger';

const log = new Logger();

if (!process.env.WORKER_ID) {
  log.error('No worker Id provided');
  process.exit(1);
}

const serverConfig = {
  RABITMQ_URL: process.env.RABITMQ_URL,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6079,
  REDIS_USERNAME: process.env.REDIS_USERNAME || undefined,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,
  WEBRTC_LISTEN_IP: process.env.WEBRTC_LISTEN_IP,
  WEBRTC_A_IP: process.env.WEBRTC_A_IP,
  WEBRTC_MIN_PORT: process.env.WEBRTC_MIN_PORT,
  WEBRTC_MAX_PORT: process.env.WEBRTC_MAX_PORT,
  WORKER_ID: process.env.WORKER_ID,
  MONITOR_POLL_INTERVAL: Number(process.env.MONITOR_POLL_INTERVAL) || 60000
};

export default serverConfig;
