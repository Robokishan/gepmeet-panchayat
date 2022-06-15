import {
  connectConsumerTransportHandler,
  connectProducerTransportHandler,
  createConsumerTransportHandler,
  createProducerTransportHandler,
  getRouterRtpCapabilities,
  mediaConsumehandler,
  mediaResumehandler,
  onProduceCommand
} from '../../mediasoup/helpers';
import AMQPRPCServer from '../amqp-rpc/AMQPRPCServer';

export interface HelperType {
  eventName: string;
  handler: any;
}

export enum MediaSoupCommand {
  getRouterRtpCapabilities = 'getRouterRtpCapabilities',
  createProducerTransport = 'createProducerTransport',
  connectProducerTransport = 'connectProducerTransport',
  produce = 'produce',
  consume = 'consume',
  resume = 'resume',
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
    eventName: MediaSoupCommand.resume,
    handler: mediaResumehandler
  }
];

export const registerRPCServerHandlers = (server: AMQPRPCServer) => {
  serverhelpers().forEach((helper) => {
    server.addCommand(helper.eventName, helper.handler);
  });
};
