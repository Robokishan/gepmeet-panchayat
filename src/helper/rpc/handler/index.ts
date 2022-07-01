import {
  connectConsumerTransportHandler,
  connectProducerTransportHandler,
  createConsumerTransportHandler,
  createProducerTransportHandler,
  getRouterRtpCapabilities,
  mediaCleanupHandler,
  mediaConsumehandler,
  mediaUserConsumeHandler,
  onProduceCommand
} from '../../mediasoup/helpers';
import AMQPRPCServer from '../amqp-rpc/AMQPRPCServer';

export interface HelperType {
  eventName: string;
  handler: unknown;
}

export enum MediaSoupCommand {
  newPeerjoin = 'newPeerjoin',
  disconnect = 'disconnect',
  closePeer = 'closePeer',
  getRouterRtpCapabilities = 'getRouterRtpCapabilities',
  createProducerTransport = 'createProducerTransport',
  connectProducerTransport = 'connectProducerTransport',
  produce = 'produce',
  consume = 'consume',
  resume = 'resume',
  consumeUser = 'consumeUser',
  createConsumerTransport = 'createConsumerTransport',
  connectConsumerTransport = 'connectConsumerTransport'
}

export const serverhelpers = (): HelperType[] => [
  {
    eventName: MediaSoupCommand.getRouterRtpCapabilities,
    handler: getRouterRtpCapabilities
  },
  {
    eventName: MediaSoupCommand.createProducerTransport,
    handler: createProducerTransportHandler
  },
  {
    eventName: MediaSoupCommand.createConsumerTransport,
    handler: createConsumerTransportHandler
  },
  {
    eventName: MediaSoupCommand.connectProducerTransport,
    handler: connectProducerTransportHandler
  },
  {
    eventName: MediaSoupCommand.connectConsumerTransport,
    handler: connectConsumerTransportHandler
  },
  {
    eventName: MediaSoupCommand.produce,
    handler: onProduceCommand
  },
  {
    eventName: MediaSoupCommand.consume,
    handler: mediaConsumehandler
  },
  {
    eventName: MediaSoupCommand.consumeUser,
    handler: mediaUserConsumeHandler
  },
  {
    eventName: MediaSoupCommand.disconnect,
    handler: mediaCleanupHandler
  }
];

export const registerRPCServerHandlers = (server: AMQPRPCServer) => {
  serverhelpers().forEach((helper) => {
    server.addCommand(helper.eventName, helper.handler);
  });
};
