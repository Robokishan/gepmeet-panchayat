import { ConsumeMessage } from 'amqplib';

export const onRoomEvents = (msg: ConsumeMessage | null): void => {
  console.log(msg.fields.routingKey, msg.content.toString());
};
