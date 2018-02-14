import {
  ClaimRewardBalanceOp,
  TransferOp,
  CommentOp,
  Operation,
  VoteOp,
} from '../operation';
import { Transaction } from '../transaction';
import { PrivateKey } from '../crypto';
import { Client } from '../client';
import { RpcApi } from '../rpc';

export class Broadcast {

  readonly client: Client;
  private callbackId = 0;

  constructor(client: Client) {
    this.client = client;
  }

  async vote(key: PrivateKey, op: VoteOp[1]) {
    return this.broadcast(key, 'vote', op);
  }

  async comment(key: PrivateKey, op: CommentOp[1]) {
    return this.broadcast(key, 'comment', op);
  }

  async transfer(key: PrivateKey, op: TransferOp[1]) {
    return this.broadcast(key, 'transfer', op);
  }

  async claimRewardBalance(key: PrivateKey, op: ClaimRewardBalanceOp[1]) {
    return this.broadcast(key, 'claim_reward_balance', op);
  }

  async broadcast(key: PrivateKey, opName: string, op: Operation[1]) {
    const props = await this.client.db.getDynamicGlobalProperties();
    const chainDate = new Date(props.time + 'Z');
    const expiration = new Date(chainDate.getTime() + 60000);
    return this.sendTransaction(key, {
      ref_block_num: props.head_block_number & 0xFFFF,
      ref_block_prefix: Buffer.from(props.head_block_id, 'hex').readUInt32LE(4),
      expiration: expiration.toISOString().slice(0, -5),
      operations: [
        [opName, op],
      ],
      extensions: [],
    });
  }

  async sendTransaction(key: PrivateKey, tx: Transaction) {
    const signedTx = key.signTransaction(tx, this.client.opts.chain_id);
    return this.client.send({
      api: RpcApi.NETWORK_BROADCAST_API,
      method: 'broadcast_transaction_synchronous',
      params: [signedTx],
    });
  }
}
