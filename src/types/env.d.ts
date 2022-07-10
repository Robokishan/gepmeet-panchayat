declare namespace NodeJS {
  export interface ProcessEnv {
    RABITMQ_URL: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
    WEBRTC_LISTEN_IP: string;
    WEBRTC_A_IP: string;
    WEBRTC_MIN_PORT: number;
    WEBRTC_MAX_PORT: number;
    WEBRTC_SERVER_PORT: number;
    WORKER_ID: string;
    MONITOR_POLL_INTERVAL: number;
  }
}
