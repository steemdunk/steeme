import {SignedTransaction} from '../transaction';

export interface Block {

  previous: string;
  timestamp: string;
  witness: string;
  transaction_merkle_root: string;
  extensions: any[];
  witness_signature: string;
  transactions: SignedTransaction[];
  block_id: string;
  signing_key: string;
  transaction_ids: string[];
}
