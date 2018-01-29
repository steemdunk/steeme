export enum SteemRpcErrorCode {
  ASSERT_EXCEPTION = 10,
  MISSING_POSTING_AUTH = 3030000
}

export interface SteemRpcStack {
  format: string;
  context: any;
  data: any;
}

export class SteemRpcError extends Error {

  readonly rpcName: string;
  readonly rpcCode: SteemRpcErrorCode;
  readonly rpcStack: SteemRpcStack[];

  constructor(rpcError: any) {
    super(rpcError.message);
    const data = rpcError.data;
    this.rpcName = data.name;
    this.rpcCode = data.code;
    this.rpcStack = data.stack;
  }

  votedSimilarly(): boolean {
    if (this.rpcCode !== SteemRpcErrorCode.ASSERT_EXCEPTION) {
      return false;
    }
    const msg = 'You have already voted in a similar way';
    return this.rpcStack[0].format.includes(msg);
  }

  votedTooFast(): boolean {
    if (this.rpcCode !== SteemRpcErrorCode.ASSERT_EXCEPTION) {
      return false;
    }
    const msg = 'Can only vote once every 3 seconds';
    return this.rpcStack[0].format.includes(msg);
  }
}
