import { Consumer, Producer, Transport } from 'mediasoup/node/lib/types';

export type MyPeer = {
  sendTransport: Transport | null;
  recvTransport: Transport | null;
  producers: Producer[] | null;
  consumers: Consumer[];
};
