import { MyRooms } from '../MyRoomState';
import { unregistermeFromRoom } from '../redis';

export const deleteRoom = (roomId: string, rooms: MyRooms) => {
  if (!(roomId in rooms)) {
    return;
  }
  delete rooms[roomId];
  unregistermeFromRoom();
};
