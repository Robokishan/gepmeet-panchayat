import amqp, { Connection } from 'amqplib';
import {
  DtlsParameters,
  MediaKind,
  RtpCapabilities,
  RtpParameters
} from 'mediasoup/node/lib/types';
import { startRPCServer } from '../../helper/rpc';
import { panchayatHandshakqQueue } from '../../utils/constants';
import Logger from '../../utils/logger';
import { Consumer } from '../mediasoup/createConsumer';
import { TransportOptions } from '../mediasoup/createTransport';
import { VoiceSendDirection } from '../mediasoup/types';

const retryInterval = 5000;
const log = new Logger();
export interface HandlerDataMap {
  'remove-speaker': { roomId: string; peerId: string };
  'destroy-room': { roomId: string };
  'close-peer': { roomId: string; peerId: string; kicked?: boolean };
  '@get-recv-tracks': {
    roomId: string;
    peerId: string;
    rtpCapabilities: RtpCapabilities;
  };
  '@send-track': {
    roomId: string;
    peerId: string;
    transportId: string;
    direction: VoiceSendDirection;
    paused: boolean;
    kind: MediaKind;
    rtpParameters: RtpParameters;
    rtpCapabilities: RtpCapabilities;
    appData: any;
  };
  '@connect-transport': {
    roomId: string;
    dtlsParameters: DtlsParameters;
    peerId: string;
    direction: VoiceSendDirection;
  };
  'create-room': {
    roomId: string;
  };
  'add-speaker': {
    roomId: string;
    peerId: string;
  };
  'join-as-speaker': {
    roomId: string;
    peerId: string;
  };
  'join-as-new-peer': {
    roomId: string;
    peerId: string;
  };
}

export type HandlerMap = {
  [Key in keyof HandlerDataMap]: (
    d: HandlerDataMap[Key],
    uid: string,
    send: <Key extends keyof OutgoingMessageDataMap>(
      obj: OutgoingMessage<Key>
    ) => void,
    errBack: () => void
  ) => void;
};

type SendTrackDoneOperationName = `@send-track-${VoiceSendDirection}-done`;
type ConnectTransportDoneOperationName =
  `@connect-transport-${VoiceSendDirection}-done`;

type OutgoingMessageDataMap = {
  'you-joined-as-speaker': {
    roomId: string;
    peerId: string;
    routerRtpCapabilities: RtpCapabilities;
    recvTransportOptions: TransportOptions;
    sendTransportOptions: TransportOptions;
  };
  error: string;
  'room-created': {
    roomId: string;
  };
  '@get-recv-tracks-done': {
    consumerParametersArr: Consumer[];
    roomId: string;
  };
  close_consumer: {
    producerId: string;
    roomId: string;
  };
  'new-peer-speaker': {
    roomId: string;
  } & Consumer;
  you_left_room: {
    roomId: string;
    kicked: boolean;
  };
  'you-are-now-a-speaker': {
    sendTransportOptions: TransportOptions;
    roomId: string;
  };
  'you-joined-as-peer': {
    roomId: string;
    peerId: string;
    routerRtpCapabilities: RtpCapabilities;
    recvTransportOptions: TransportOptions;
  };
} & {
  [Key in SendTrackDoneOperationName]: {
    error?: string;
    id?: string;
    roomId: string;
  };
} & {
  [Key in ConnectTransportDoneOperationName]: {
    error?: string;
    roomId: string;
  };
};

type OutgoingMessage<Key extends keyof OutgoingMessageDataMap> = {
  op: Key;
  d: OutgoingMessageDataMap[Key];
} & ({ uid: string } | { rid: string });
interface IncomingChannelMessageData<Key extends keyof HandlerMap> {
  op: Key;
  d: HandlerDataMap[Key];
  uid: string;
}

export let send = <Key extends keyof OutgoingMessageDataMap>(
  _obj: OutgoingMessage<Key>
  // temporar fix
  // eslint-disable-next-line @typescript-eslint/no-empty-function
) => {};

export const startRabbit = async () => {
  let conn: Connection;
  try {
    conn = await amqp.connect(process.env.RABITMQ_URL);
    await startRPCServer(conn, panchayatHandshakqQueue);
  } catch (err) {
    log.error('Unable to connect to RabbitMQ: ', err);
    setTimeout(async () => await startRabbit(), retryInterval);
    return;
  }
};

// export const startRabbit = async (handler: HandlerMap) => {
//   log.info(
//     'trying to connect to: ',
//     process.env.RABBITMQ_URL || 'amqp://localhost'
//   );
//   let conn: Connection;
//   try {
//     conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
//   } catch (err) {
//     log.error('Unable to connect to RabbitMQ: ', err);
//     setTimeout(async () => await startRabbit(handler), retryInterval);
//     return;
//   }
//   const id = process.env.QUEUE_ID || '';
//   log.info('rabbit connected ' + id);
//   conn.on('close', async function (err: Error) {
//     log.error('Rabbit connection closed with error: ', err);
//     setTimeout(async () => await startRabbit(handler), retryInterval);
//   });
//   const channel = await conn.createChannel();
//   const sendQueue = 'kousa_queue' + id;
//   const onlineQueue = 'kousa_online_queue' + id;
//   const receiveQueue = 'shawarma_queue' + id;
//   log.info(sendQueue, onlineQueue, receiveQueue);
//   await Promise.all([
//     channel.assertQueue(receiveQueue),
//     channel.assertQueue(sendQueue),
//     channel.assertQueue(onlineQueue)
//   ]);
//   send = <Key extends keyof OutgoingMessageDataMap>(
//     obj: OutgoingMessage<Key>
//   ) => {
//     channel.sendToQueue(sendQueue, Buffer.from(JSON.stringify(obj)));
//   };
//   await channel.purgeQueue(receiveQueue);
//   await channel.consume(
//     receiveQueue,
//     async (e) => {
//       const m = e?.content.toString();
//       if (m) {
//         let data: IncomingChannelMessageData<any> | undefined;
//         try {
//           data = JSON.parse(m);
//         } catch {}
//         // log.info(data.op);
//         if (data && data.op && data.op in handler) {
//           const { d: handlerData, op: operation, uid } = data;
//           try {
//             log.info(operation);
//             await handler[operation as keyof HandlerMap](
//               handlerData,
//               uid,
//               send,
//               () => {
//                 log.info(operation);
//                 send({
//                   op: 'error',
//                   d: 'The voice server is probably redeploying, it should reconnect in a few seconds. If not, try refreshing.',
//                   uid: uid
//                 });
//               }
//             );
//           } catch (err) {
//             log.info(operation, err);
//           }
//         }
//       }
//     },
//     { noAck: true }
//   );
//   channel.sendToQueue(
//     onlineQueue,
//     Buffer.from(JSON.stringify({ op: 'online' }))
//   );
// };
