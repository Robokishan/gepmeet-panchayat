import { Connection } from 'amqplib';
import Logger from '../../utils/logger';
import AMQPRPCClient from './amqp-rpc/AMQPRPCClient';
import AMQPRPCServer from './amqp-rpc/AMQPRPCServer';
import { registerRPCServerHandlers } from './handler';

const log = new Logger();

// NOTE: export rpcserver and rpcclient if required using outside block variable
const startRPCServer = async (
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

let rpcClient: AMQPRPCClient = null;

const startRPCClient = async (
  rabbitMQConnection: Connection,
  queue: string
) => {
  rpcClient = new AMQPRPCClient(rabbitMQConnection, {
    requestsQueue: queue
  });
  await rpcClient.start();
};

export { startRPCClient, startRPCServer, rpcClient };
