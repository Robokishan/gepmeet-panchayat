import amqp, { Channel, Connection } from 'amqplib';
import serverConfig from '../../config/server';
import { startRPCClient, startRPCServer } from '../../helper/rpc';
import { panchayatHandshakqQueue } from '../../utils/constants/queue';
import Logger from '../../utils/logger';
import { createExchanges } from './exchanges';
import { createQueues } from './queues';

const retryInterval = 5000;
const log = new Logger();

let rabbitMQConnection: Connection;
let rabbitMQChannel: Channel;

const startRabbit = async () => {
  return new Promise((resolve, _reject) => {
    log.info('Rabbitmq Connection');
    amqp
      .connect(serverConfig.RABITMQ_URL)
      .then(async (conn) => {
        conn.on('close', async (err: Error) => {
          log.error('Rabbit connection closed', err);
        });
        conn.on('error', async (err: Error) => {
          log.error('Rabbit connection error: ', err);
          conn.close();
          conn.removeAllListeners();
          setTimeout(async () => await startRabbit(), retryInterval);
        });
        rabbitMQConnection = conn;
        log.info(`Rabbitmq Connection Successfull`);
        rabbitMQChannel = await rabbitMQConnection.createChannel();
        await createQueues(rabbitMQChannel);
        await createExchanges(rabbitMQChannel);
        await startRPCServer(rabbitMQConnection, panchayatHandshakqQueue);
        startRPCClient(rabbitMQConnection, panchayatHandshakqQueue);
        resolve(conn);
      })
      .catch((err) => {
        log.error(err);
        setTimeout(async () => await startRabbit(), retryInterval);
      });
  });
};

export { rabbitMQConnection, startRabbit, rabbitMQChannel };
