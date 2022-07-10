import { Router, WebRtcTransport } from 'mediasoup/node/lib/types';
import { webRtcServer } from '.';
import mediasoupConfig from '../../config/mediasoup';
import Logger from '../../utils/logger';
import { VoiceSendDirection } from './types';

const logger = new Logger();

export const transportToOptions = ({
  id,
  iceParameters,
  iceCandidates,
  dtlsParameters
}: WebRtcTransport) => ({ id, iceParameters, iceCandidates, dtlsParameters });

export type TransportOptions = ReturnType<typeof transportToOptions>;

export const createTransport = async (
  direction: VoiceSendDirection,
  router: Router,
  peerId: string
) => {
  logger.info('create-transport', direction, peerId);
  const { initialAvailableOutgoingBitrate } =
    mediasoupConfig.mediasoup.webRtcTransportOptions;

  const transport = await router.createWebRtcTransport({
    enableUdp: false,
    enableTcp: true,
    preferUdp: true,
    webRtcServer: webRtcServer,
    initialAvailableOutgoingBitrate: initialAvailableOutgoingBitrate,
    appData: { peerId, clientDirection: direction }
  });
  // const transport = await router.createWebRtcTransport({
  //   ...mediasoupConfig.mediasoup.webRtcServerOptions
  // })
  return transport;
};
