'use strict';

import { Channel, Connection } from 'amqplib';

/**
 * Base class for AMQPRPCServer/AMQPRPCClient.
 *
 * @class
 */
class AMQPEndpoint {
  /**
   *
   * @param {*} connection Connection reference created from `amqplib` library
   *
   * @param {Object} [params]
   */
  _connection: Connection = null;
  _channel: Channel;
  _params: any;
  constructor(connection, params = {}) {
    this._connection = connection;
    this._channel = null;
    this._params = Object.assign({}, params);
  }

  /**
   * Initialization before starting working
   * NOTE! Race condition is not handled here,
   *    so it's better to not invoke the method several times (e.g. from multiple "threads")
   *
   * @return {Promise<void>}
   */
  async start() {
    if (this._channel) {
      return;
    }

    this._channel = await this._connection.createChannel();
  }

  /**
   * Opposite to this.start() – clearing
   * NOTE! Race condition is not handled here,
   *    so it's better to not invoke the method several times (e.g. from multiple "threads")
   *
   * @return {Promise<void>}
   */
  async disconnect() {
    if (!this._channel) return;
    await this._channel.close();
    this._channel = null;
  }
}

export default AMQPEndpoint;
