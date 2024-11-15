import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('NATS client has not been initialized');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this._client!.on('connect', () => {
        console.error('Connecting to NATS');
        resolve();
      });
      this._client!.on('error', (err) => {
        console.error('Error connecting to NATS', err);
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();