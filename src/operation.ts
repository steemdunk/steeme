import {Asset} from './asset';

export interface Operation {
  0: string;
  1: {[key: string]: any};
}

export interface VoteOp extends Operation {
  0: 'vote';
  1: {
    voter: string;
    author: string;
    permlink: string;
    weight: number;
  };
}

export interface CommentOp extends Operation {
  0: 'comment';
  1: {
    permlink: string;
    parent_permlink: string;
    author: string;
    parent_author: string;
    title: string;
    body: string;
    json_metadata: string;
  };
}

export interface TransferOp extends Operation {
  0: 'transfer';
  1: {
    from: string;
    to: string;
    amount: Asset|string;
    memo: string;
  }
}

export interface DelegateVestingSharesOp extends Operation {
  0: 'delegate_vesting_shares',
  1: {
    delegator: string;
    delegatee: string;
    vesting_shares: Asset|string;
  }
}

export interface ClaimRewardBalanceOp extends Operation {
  0: 'claim_reward_balance',
  1: {
    account: string,
    reward_steem: Asset|string,
    reward_sbd: Asset|string,
    reward_vests: Asset|string
  }
}
