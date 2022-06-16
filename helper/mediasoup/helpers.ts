import { ProducerOptions } from 'mediasoup/node/lib/Producer';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import { DtlsParameters } from 'mediasoup/node/lib/WebRtcTransport';
import { router } from '../../client/mediasoup';
import {
  Consumer,
  createConsumer
} from '../../client/mediasoup/createConsumer';
import {
  createTransport,
  transportToOptions
} from '../../client/mediasoup/createTransport';
import Logger from '../../utils/logger';
import { rooms } from '../MyRoomState';
import { createRoom } from './createRoom';
import { SessionDataType } from './types';

interface SessionData {
  sessionData: SessionDataType;
}

interface TransportArg extends SessionData {
  dtlsParameters: DtlsParameters;
}

interface ProduceArg extends SessionData {
  produceMeta: ProducerOptions;
}

interface MediaConsumeArg extends SessionData {
  rtpCapabilities: RtpCapabilities;
}
interface MediaResumeArg extends SessionData {}

const log = new Logger();

export const createProducerTransportHandler = async (
  sessionData: SessionDataType
) => {
  const { roomId, userId } = sessionData;
  if (!rooms[roomId]) {
    rooms[roomId] = createRoom();
  }

  if (!rooms[roomId]?.state[userId]) {
    rooms[roomId].state = {
      ...rooms[roomId].state,
      [userId]: {
        recvTransport: null,
        sendTransport: null,
        consumers: [],
        producers: []
      }
    };
  }

  const sendTransport = await createTransport('send', router, userId);

  rooms[roomId].state[userId] = {
    ...rooms[roomId].state[userId],
    sendTransport
  };

  return transportToOptions(sendTransport);
};

export const connectProducerTransportHandler = async (
  producerMeta: TransportArg
) => {
  const {
    sessionData: { roomId, userId },
    dtlsParameters
  } = producerMeta;
  await rooms[roomId].state[userId].sendTransport.connect({ dtlsParameters });
  return 'ok';
};

export const connectConsumerTransportHandler = async (
  producerMeta: TransportArg
) => {
  const {
    sessionData: { roomId, userId },
    dtlsParameters
  } = producerMeta;
  await rooms[roomId].state[userId].recvTransport.connect({ dtlsParameters });
  return 'ok';
};

export const createConsumerTransportHandler = async (
  sessionData: SessionDataType
) => {
  const { roomId, userId } = sessionData;
  if (!rooms[roomId]) {
    rooms[roomId] = createRoom();
  }

  if (!rooms[roomId]?.state[userId]) {
    rooms[roomId].state = {
      ...rooms[roomId].state,
      [userId]: {
        recvTransport: null,
        sendTransport: null,
        consumers: [],
        producers: []
      }
    };
  }

  const recvTransport = await createTransport('recv', router, userId);

  rooms[roomId].state[userId] = {
    ...rooms[roomId].state[userId],
    recvTransport
  };

  return transportToOptions(recvTransport);
};

export const onProduceCommand = async (produceArg: ProduceArg) => {
  const {
    sessionData: { roomId, userId },
    produceMeta
  } = produceArg;

  const producer = await rooms[roomId].state[userId].sendTransport.produce(
    produceMeta
  );

  rooms[roomId].state[userId].producers.push(producer);
  // TODO: IDEALLY SHOULD EMIT THAT NEW PRODUCER HAS BEEN ADDED
  return { id: producer.id };
};

export const getRouterRtpCapabilities = () => ({
  rtpCapabilities: router.rtpCapabilities
});

export const mediaConsumehandler = async (mediaCosumeArg: MediaConsumeArg) => {
  const {
    sessionData: { roomId, userId },
    rtpCapabilities
  } = mediaCosumeArg;
  const state = rooms[roomId].state;
  const { recvTransport } = state[userId];

  const consumers = [];
  const consumersParameters: Consumer[] = [];
  for (const theirPeerId of Object.keys(state)) {
    const peerState = state[theirPeerId];

    if (
      theirPeerId == userId ||
      !peerState ||
      !(peerState.producers?.length > 0)
    ) {
      continue;
    }

    for (const producer of peerState.producers) {
      try {
        consumersParameters.push(
          await createConsumer(
            router,
            producer,
            rtpCapabilities,
            recvTransport,
            userId,
            rooms[roomId].state[userId]
          )
        );
      } catch (error) {
        log.error(error);
      }
    }
    consumers.push(consumersParameters);
  }
  return { consumerParameters: consumers };
};

export const mediaResumehandler = async (mediaResumeArg: MediaResumeArg) => {};
