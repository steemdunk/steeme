import {SignedTransaction} from '../transaction';
import {DisconnectedError} from '../client';
import {Operation} from '../operation';
import {Client} from '../client';
import {Block} from './models';

export type BlockNumHandler = (err: any, blockNum: number) => void;
export type BlockHandler = (err: any, block: Block, blockNum: number) => void;
export type TxHandler = (err: any, tx: SignedTransaction) => void;
export type OpHandler = (err: any, op: Operation) => void;
export type ReleaseFunc = () => void;

export enum StreamMode {
  HEAD,
  IRREVERSIBLE
}

export class Blockchain {

  public readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public streamBlockNumbers(handler: BlockNumHandler,
                            mode = StreamMode.HEAD,
                            start?: number): ReleaseFunc {
    let running: boolean = true;
    const update = async () => {
      if (!running) {
        return;
      }
      try {
        let blockNum;
        if (mode === StreamMode.HEAD) {
          // Stream from the third block of the head to prevent null blocks or
          // any other unknown issues from being returned through the network
          blockNum = (await this.client.db.getCurrentBlockNumber()) - 3;
        } else {
          blockNum = await this.client.db.getIrreversibleBlockNumber();
        }
        if (start === undefined) {
          start = blockNum - 1;
        }

        while (start < blockNum) {
          handler(undefined, ++start);
        }
      } catch (e) {
        if (!(e instanceof DisconnectedError)) {
          handler(e, undefined as any);
        }
      } finally {
        setTimeout(() => {
          update();
        }, 1000);
      }
    };

    update();

    return () => {
      running = false;
    };
  }

  public streamBlocks(handler: BlockHandler): ReleaseFunc {
    const handleBlock = async (num: number) => {
      try {
        const block = await this.client.db.getBlock(num);
        handler(undefined, block, num);
      } catch (e) {
        if (e instanceof DisconnectedError) {
          // Replay failed blocks
          setTimeout(() => {
            handleBlock(num);
          }, 1000);
        } else {
          handler(e, undefined!, undefined!);
        }
      }
    };

    return this.streamBlockNumbers((err, num) => {
      if (err) {
        return handler(err, undefined!, undefined!);
      }
      handleBlock(num);
    });
  }

  public streamTransactions(handler: TxHandler): ReleaseFunc {
    return this.streamBlocks((err, block) => {
      if (err) {
        return handler(err, undefined!);
      }
      block.transactions.forEach(tx => {
        handler(undefined, tx);
      });
    });
  }

  public streamOperations(handler: OpHandler): ReleaseFunc {
    return this.streamTransactions((err, tx) => {
      if (err) {
        return handler(err, undefined!);
      }
      tx.operations.forEach(op => {
        handler(undefined, op);
      });
    });
  }
}
