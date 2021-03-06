import {TypeSerializer as TS} from './type_serializer';
import * as ByteBuffer from 'bytebuffer';

/* tslint:disable:object-literal-sort-keys */

export class Types {
  static readonly vote = TS.op(0, {
    voter: TS.string,
    author: TS.string,
    permlink: TS.string,
    weight: TS.int16,
  });

  static readonly comment = TS.op(1, {
    parent_author: TS.string,
    parent_permlink: TS.string,
    author: TS.string,
    permlink: TS.string,
    title: TS.string,
    body: TS.string,
    json_metadata: TS.string,
  });

  static readonly transfer = TS.op(2, {
    from: TS.string,
    to: TS.string,
    amount: TS.asset,
    memo: TS.string
  });

  static readonly claim_reward_balance = TS.op(39, {
    account: TS.string,
    reward_steem: TS.asset,
    reward_sbd: TS.asset,
    reward_vests: TS.asset
  });

  static readonly transaction = TS.object({
    ref_block_num: TS.uint16,
    ref_block_prefix: TS.uint32,
    expiration: TS.date,
    operations: TS.array(TS.opData),
    extensions: TS.array(TS.string),
  });
}
