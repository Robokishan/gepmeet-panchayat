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
  try {
    rabbitMQConnection = await amqp.connect(serverConfig.RABITMQ_URL);
    rabbitMQChannel = await rabbitMQConnection.createChannel();
    await createQueues(rabbitMQChannel);
    await createExchanges(rabbitMQChannel);
    await startRPCServer(rabbitMQConnection, panchayatHandshakqQueue);
    startRPCClient(rabbitMQConnection, panchayatHandshakqQueue);
  } catch (err) {
    log.error('Unable to connect to RabbitMQ: ', err);
    setTimeout(async () => await startRabbit(), retryInterval);
    return;
  }
};

export { rabbitMQConnection, startRabbit, rabbitMQChannel };
