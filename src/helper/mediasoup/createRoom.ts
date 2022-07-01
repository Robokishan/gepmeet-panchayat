import { router, worker } from '../../client/mediasoup';

export const createRoom = () => {
  return { worker, router, state: {} };
};
