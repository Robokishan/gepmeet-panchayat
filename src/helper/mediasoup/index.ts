import { MyPeer } from '../MyPeer';

export const closePeer = (state: MyPeer) => {
  state.producers.forEach((c) => c.close());
  state.recvTransport?.close();
  state.sendTransport?.close();
  state.consumers.forEach((c) => c.close());
};
