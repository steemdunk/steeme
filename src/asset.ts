export enum AssetUnit {
  STEEM = "STEEM",
  SBD = "SBD",
  VESTS = "VESTS"
}

export interface Asset {
  amount: number;
  unit: AssetUnit;
}
