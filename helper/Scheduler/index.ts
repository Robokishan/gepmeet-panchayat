import { Queue, QueueScheduler, Worker } from 'bullmq';
import redis from '../../client/redis';
import serverConfig from '../../config/server';
import { rooms } from '../MyRoomState';
import { sendMessageToMonitorQueue } from '../rabbitmq';

new QueueScheduler('monitor', {
  connection: redis
});

const queue = new Queue('monitor', {
  connection: redis
});

queue.add(
  'mediasoup',
  {},
  {
    repeat: {
      every: serverConfig.MONITOR_POLL_INTERVAL
    }
  }
);

// const log = new Logger();

const schedulerWorker = new Worker(
  'monitor',
  async (job) => {
    if (job.name == 'mediasoup') {
      let totalProducers = 0;
      let totalConsumers = 0;
      let totalState = 0;
      if (Object.keys(rooms).length > 0) {
        Object.keys(rooms).forEach((room) => {
          Object.entries(rooms[room].state).forEach(([, value]) => {
            totalProducers += value.producers?.length ?? 0;
            totalConsumers += value.producers?.length ?? 0;
          });

          totalState += Object.keys(rooms[room].state).length;
        });
      }

      // log.debug(
      //   'Total : ',
      //   Object.keys(rooms).length,
      //   'Producers : ',
      //   totalProducers,
      //   'Consumers : ',
      //   totalConsumers
      // );

      sendMessageToMonitorQueue({
        totalConsumers,
        totalProducers,
        totalState,
        rooms: Object.keys(rooms).length
      });
    }
  },
  {
    connection: redis,
    autorun: false
  }
);

const createScheduler = async () => {
  schedulerWorker.run();
};

export { createScheduler };
