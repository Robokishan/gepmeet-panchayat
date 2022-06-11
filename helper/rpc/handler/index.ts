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
    handler: () => ({
      message: 'hi'
    })
  }
];

export const registerRPCServerHandlers = (server: AMQPRPCServer) => {
  serverhelpers().forEach((helper) => {
    server.addCommand(helper.eventName, helper.handler);
  });
};
