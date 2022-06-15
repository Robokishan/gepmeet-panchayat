import { Router } from 'mediasoup/node/lib/Router';
import { Worker } from 'mediasoup/node/lib/Worker';
import { MyPeer } from '../MyPeer';

type MyRoomState = Record<string, MyPeer>; //userId

type MyRooms = Record<
  string, //roomId
  { worker: Worker; router: Router; state: MyRoomState }
>;

const rooms: MyRooms = {};

export { rooms, MyRoomState, MyRooms };
