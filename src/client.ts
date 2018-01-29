import {Blockchain} from './blockchain';
import {Broadcast} from './broadcast';
import {SteemRpcError} from './error';
import * as request from 'superagent';
import {Database} from './database';
import * as newDebug from 'debug';
import {RpcCall} from './rpc';

const debug = newDebug('steeme:client');

export interface NetOptions {
  address_prefix: string;
  chain_id: string;
  node: string;
}

export class DisconnectedError extends Error {

  readonly networkError: any;

  constructor(err: any) {
    super(err.code);
    this.networkError = err;
  }
}

export class Client {

  public readonly blockchain = new Blockchain(this);
  public readonly broadcast = new Broadcast(this);
  public readonly db = new Database(this);
  public readonly opts: NetOptions;
  private sendId: number = 0;

  constructor(opts?: NetOptions) {
    const def: NetOptions = {
      address_prefix: 'STM',
      chain_id:
          '0000000000000000000000000000000000000000000000000000000000000000',
      node: 'https://api.steemit.com',
    };
    this.opts = Object.assign(def, opts);
  }

  public async send(rpc: RpcCall): Promise<any> {
    const payload = {
      id: this.sendId++,
      jsonrpc: '2.0',
      method: 'call',
      params: [rpc.api, rpc.method, rpc.params],
    };
    debug('Sent message: %j', payload);

    let res: any;
    try {
      const serverRes = await request.post(this.opts.node)
                                      .send(payload)
                                      .timeout({ deadline: 10000 });
      res = serverRes.body;
      if (Object.keys(res).length === 0 && res.constructor === Object) {
        res = JSON.parse(serverRes.text);
      }
    } catch (e) {
      throw new DisconnectedError(e);
    }
    debug('Received message: %j', res);
    if (res.error) {
      throw new SteemRpcError(res.error);
    }
    return res.result;
  }

}
