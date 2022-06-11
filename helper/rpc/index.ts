import { Connection } from 'amqplib';
import Logger from '../../utils/logger';
import AMQPRPCClient from './amqp-rpc/AMQPRPCClient';
import AMQPRPCServer from './amqp-rpc/AMQPRPCServer';
import { registerRPCServerHandlers } from './handler';

const log = new Logger();

// NOTE: export rpcserver and rpcclient if required using outside block variable
export const startRPCServer = async (
  rabbitMQConnection: Connection,
  queue: string
): Promise<void> => {
  const rpcServer = new AMQPRPCServer(rabbitMQConnection, {
    requestsQueue: queue
  });
  await rpcServer.start();
  registerRPCServerHandlers(rpcServer);
  log.info('RPC server loaded');
};

export const startRPCClient = async (
  rabbitMQConnection: Connection,
  queue: string
): Promise<AMQPRPCClient> => {
  const rpcClient = new AMQPRPCClient(rabbitMQConnection, {
    requestsQueue: queue
  });
  await rpcClient.start();
  return rpcClient;
};
