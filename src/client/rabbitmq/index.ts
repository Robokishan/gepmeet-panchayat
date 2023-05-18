import amqp, { Channel, Connection } from 'amqplib';
import serverConfig from '../../config/server';
import { startRPCClient, startRPCServer } from '../../helper/rpc';
import Logger from '../../utils/logger';
import { panchayatHandshakqQueue } from './constants';
import { createExchanges, createQueues } from './utils';

const retryInterval = 500;
const log = new Logger();

let rabbitMQConnection: Connection;
let rabbitMQChannel: Channel;

const startRabbit = async () => {
  return new Promise((resolve, _reject) => {
    log.info('Rabbitmq Connecting');
    amqp
      .connect(serverConfig.RABITMQ_URL)
      .then(async (conn) => {
        conn.on('close', async (err: Error) => {
          log.error('Rabbit connection closed', err);
        });
        conn.on('error', async (err: Error) => {
          log.error('Rabbit connection error: ', err);
          conn.removeAllListeners();
          setTimeout(
            () => startRabbit().then((conn) => resolve(conn)),
            retryInterval
          );
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
      .catch(async (err) => {
        log.error(err);
        // setTimeout(
        //   () => startRabbit().then((conn) => resolve(conn)),
        //   retryInterval
        // );
      });
  });
};

export { rabbitMQConnection, startRabbit, rabbitMQChannel };
