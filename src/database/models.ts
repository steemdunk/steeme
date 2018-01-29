export interface Block {
  previous: string;
  timestamp: string;
  witness: string;
  transaction_merkle_root: string;
  extensions: any[];
  witness_signature: string;
  transactions: any[];
  block_id: string;
  signing_key: string;
  transaction_ids: any[];
}

export interface DiscussionQuery {
  limit: number;
  tag?: string;
  start_author?: string;
  start_permlink?: string;
  truncate_body?: number;
}

export interface ActiveVote {
  voter: string;
  weight: string;
  rshares: number;
  percent: number;
  reputation: number;
  time: string;
}

export interface Discussion {
  id: number;
  author: string;
  permlink: string;
  category: string;
  parent_author: string;
  parent_permlink: string;
  title: string;
  body: string;
  json_metadata: string;
  last_update: string;
  created: string;
  active: string;
  last_payout: string;
  depth: number;
  children: number;
  net_rshares: number;
  abs_rshares: number;
  vote_rshares: number;
  children_abs_rshares: number;
  cashout_time: string;
  max_cashout_time: string;
  total_vote_weight: number;
  reward_weight: number;
  total_payout_value: string;
  curator_payout_value: string;
  author_rewards: number;
  net_votes: number;
  root_comment: number;
  max_accepted_payout: string;
  percent_steem_dollars: number;
  allow_replies: boolean;
  allow_votes: boolean;
  allow_curation_rewards: boolean;
  beneficiaries: any[];
  url: string;
  root_title: string;
  pending_payout_value: string;
  total_pending_payout_value: string;
  active_votes: ActiveVote[];
  replies: any[];
  author_reputation: number;
  promoted: string;
  body_length: number;
  reblogged_by: any[];
}

export interface DynamicGlobalProperties {
  head_block_number: number;
  head_block_id: string;
  time: string;
  current_witness: string;
  total_pow: string;
  num_pow_witnesses: number;
  virtual_supply: string;
  current_supply: string;
  confidential_supply: string;
  current_sbd_supply: string;
  confidential_sbd_supply: string;
  total_vesting_fund_steem: string;
  total_vesting_shares: string;
  total_reward_fund_steem: string;
  total_reward_shares2: string;
  pending_rewarded_vesting_shares: string;
  pending_rewarded_vesting_steem: string;
  sbd_interest_rate: number;
  sbd_print_rate: number;
  average_block_size: number;
  maximum_block_size: number;
  current_aslot: number;
  recent_slots_filled: string;
  participation_count: number;
  last_irreversible_block_num: number;
  max_virtual_bandwidth: string;
  current_reserve_ratio: number;
  vote_power_reserve_rate: number;
}

export interface AccountAuths {
  weight_threshold: number;
  account_auths: any[];
  key_auths: any[];
}

export interface Account {
  id: number;
  name: string;
  owner: AccountAuths;
  active: AccountAuths;
  posting: AccountAuths;
  memo_key: string;
  json_metadata: string;
  proxy: string;
  last_owner_update: string;
  last_account_update: string;
  created: string;
  mined: boolean;
  owner_challenged: boolean;
  active_challenged: boolean;
  last_owner_proved: string;
  last_active_proved: string;
  recovery_account: string;
  last_account_recovery: string;
  reset_account: string;
  comment_count: number;
  lifetime_vote_count: number;
  post_count: number;
  can_vote: boolean;
  voting_power: number;
  last_vote_time: string;
  balance: string;
  savings_balance: string;
  sbd_balance: string;
  sbd_seconds: string;
  sbd_seconds_last_update: string;
  sbd_last_interest_payment: string;
  savings_sbd_balance: string;
  savings_sbd_seconds: string;
  savings_sbd_seconds_last_update: string;
  savings_sbd_last_interest_payment: string;
  savings_withdraw_requests: number;
  reward_sbd_balance: string;
  reward_steem_balance: string;
  reward_vesting_balance: string;
  reward_vesting_steem: string;
  vesting_shares: string;
  delegated_vesting_shares: string;
  received_vesting_shares: string;
  vesting_withdraw_rate: string;
  next_vesting_withdrawal: string;
  withdrawn: number;
  to_withdraw: number;
  withdraw_routes: number;
  curation_rewards: number;
  posting_rewards: number;
  proxied_vsf_votes: number[];
  witnesses_voted_for: number;
  average_bandwidth: number;
  lifetime_bandwidth: number;
  last_bandwidth_update: string;
  average_market_bandwidth: number;
  lifetime_market_bandwidth: number;
  last_market_bandwidth_update: string;
  last_post: string;
  last_root_post: string;
  vesting_balance: string;
  reputation: number;
  transfer_history: any[];
  market_history: any[];
  post_history: any[];
  vote_history: any[];
  other_history: any[];
  witness_votes: any[];
  tags_usage: any[];
  guest_bloggers: any[];
}
