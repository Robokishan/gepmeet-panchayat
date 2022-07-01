import {
  ConsumerType,
  Producer,
  Router,
  RtpCapabilities,
  RtpParameters,
  Transport
} from 'mediasoup/node/lib/types';
import { closePeer } from '../../helper/mediasoup';
import { MyPeer } from '../../helper/MyPeer';
import { rooms } from '../../helper/MyRoomState';
import { rpcClient } from '../../helper/rpc';
import { MediaSoupCommand } from '../../helper/rpc/handler';
import { ROOM_EXCHANGE } from '../../utils/constants/queue';
import { getRoomKey } from '../../utils/room';
import { rabbitMQChannel } from '../rabbitmq';

export const createConsumer = async (
  router: Router,
  producer: Producer,
  rtpCapabilities: RtpCapabilities,
  transport: Transport,
  peerId: string,
  peerConsuming: MyPeer,
  roomId: string
): Promise<Consumer> => {
  if (!router.canConsume({ producerId: producer.id, rtpCapabilities })) {
    throw new Error(
      `recv-track: client cannot consume ${producer.appData.peerId} ${roomId}`
    );
  }

  const consumer = await transport.consume({
    producerId: producer.id,
    rtpCapabilities,
    paused: false, // see note above about always starting paused
    appData: { peerId, mediaPeerId: producer.appData.peerId }
  });

  // consumer.on('transportclose', () => {
  //   log.info(`consumer's transport closed`, consumer.id);
  //   closeConsumer(peerId, roomId);
  //   // closeConsumer(consumer, peerConsuming);
  // });
  // consumer.on('producerclose', () => {
  //   closeConsumer(peerId, roomId);
  // });

  peerConsuming.consumers.push(consumer);

  return {
    producerId: producer.id,
    id: consumer.id,
    kind: consumer.kind,
    rtpParameters: consumer.rtpParameters,
    type: consumer.type,
    producerPaused: consumer.producerPaused
  };
};

const _closeConsumer = (peerId, roomId) => {
  if (rooms[roomId]?.state[peerId]) {
    const peer = rooms[roomId].state[peerId];
    closePeer(peer);
    rpcClient.sendCommand(MediaSoupCommand.closePeer, [
      { roomId: roomId, userId: peerId }
    ]);
    rabbitMQChannel.publish(
      ROOM_EXCHANGE,
      getRoomKey(roomId),
      Buffer.from(
        JSON.stringify({
          msg: MediaSoupCommand.closePeer,
          sessionData: {
            roomId,
            peerId
          }
        })
      )
    );
  }
};

export interface Consumer {
  producerId: string;
  id: string;
  kind: string;
  rtpParameters: RtpParameters;
  type: ConsumerType;
  producerPaused: boolean;
}
