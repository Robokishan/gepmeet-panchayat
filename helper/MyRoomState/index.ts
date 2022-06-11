import { Router } from 'mediasoup/node/lib/Router';
import { MyPeer } from '../MyPeer';

export type MyRoomState = Record<string, MyPeer>; //userId

export type MyRooms = Record<
  string, //roomId
  { worker: Worker; router: Router; state: MyRoomState }
>;
