export enum AssetUnit {
  STEEM = "STEEM",
  SBD = "SBD"
}

export interface Asset {

  amount: number;
  unit: AssetUnit;

}
