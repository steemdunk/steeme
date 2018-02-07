import { Account, Discussion } from './database';
import { Asset, AssetUnit } from './asset';

export class SteemUtil {
  /**
   * 100% voting weight
   */
  public static readonly WEIGHT_100_PERCENT = 10000;

  /**
   * Voting power regeneration per second
   */
  public static VP_REGEN_SECONDS = 0.023148148;

  public static stringToDate(str: string): Date {
    if (!/Z$/.test(str)) {
      str += 'Z';
    }
    return new Date(str);
  }

  public static parseAsset(str: string): Asset {
    const split = str.split(' ');
    let unit: AssetUnit;
    if (split[1] === AssetUnit.SBD) {
      unit = AssetUnit.SBD;
    } else if (split[1] === AssetUnit.STEEM) {
      unit = AssetUnit.STEEM;
    } else if (split[1] === AssetUnit.VESTS) {
      unit = AssetUnit.VESTS;
    } else {
      throw new Error('Invalid unit parsing asset: ' + str);
    }
    return {
      amount: parseFloat(split[0]),
      unit
    };
  }

  public static getVotingPower(acc: Account): number {
    let power = acc.voting_power;
    {
      const lastVote = new Date(acc.last_vote_time).getTime() / 1000;
      const now = Date.now() / 1000;
      power += (now - lastVote) * SteemUtil.VP_REGEN_SECONDS;
    }
    return Math.min(power, SteemUtil.WEIGHT_100_PERCENT);
  }

  public static getVotingPowerPct(acc: Account): number {
    const vp = SteemUtil.getVotingPower(acc) / SteemUtil.WEIGHT_100_PERCENT;
    return Math.min(Math.round(vp * 10000) / 100, 100);
  }

  public static recoverySeconds(acc: Account, target: number): number {
    const delta = target - SteemUtil.getVotingPower(acc);
    if (delta <= 0) return 0;
    const time = new Date(acc.last_vote_time).getTime() / 1000;
    return Math.round(delta / SteemUtil.VP_REGEN_SECONDS * 1000) / 1000;
  }
}

export class Util {
  public static delay(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
