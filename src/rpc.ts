export enum RpcApi {
  CONDENSER_API = 'condenser_api',
  NETWORK_BROADCAST_API = 'network_broadcast_api',
}

export interface RpcCall {
  api: RpcApi;
  method: string;
  params: any[];
}
