import * as mediasoup from 'mediasoup';
import { Router, WebRtcServer, Worker } from 'mediasoup/node/lib/types';
import mediasoupConfig from '../../config/mediasoup';
import Logger from '../../utils/logger';

interface ReturnType {
  worker: Worker;
  router: Router;
  webRtcServer: WebRtcServer;
}

const logger = new Logger();
export let worker: Worker = null;
export let router: Router = null;
export let webRtcServer: WebRtcServer = null;
export async function startMediasoup(): Promise<ReturnType> {
  worker = await mediasoup.createWorker({
    logLevel: mediasoupConfig.mediasoup.workerSettings.logLevel,
    logTags: mediasoupConfig.mediasoup.workerSettings.logTags,
    rtcMinPort: mediasoupConfig.mediasoup.workerSettings.rtcMinPort,
    rtcMaxPort: mediasoupConfig.mediasoup.workerSettings.rtcMaxPort
  });
  worker.on('died', () => {
    logger.error('mediasoup worker died (this should never happen)');
    process.exit(1);
  });

  webRtcServer = await worker.createWebRtcServer(
    mediasoupConfig.mediasoup.webRtcServerOptions
  );

  const mediaCodecs = mediasoupConfig.mediasoup.routerOptions.mediaCodecs;
  router = await worker.createRouter({ mediaCodecs });

  logger.info(`Started Mediasoup Worker => ${worker.pid}`);

  return {
    worker,
    router,
    webRtcServer
  };
}
