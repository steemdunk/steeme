import {Client} from '../client';
import {RpcApi} from '../rpc';
import {
  Block,
  Account,
  Discussion,
  DiscussionQuery,
  DynamicGlobalProperties
} from './models';

export * from './models';

export class Database {

  public readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public getDynamicGlobalProperties(): Promise<DynamicGlobalProperties> {
    return this.client.send({
      api: RpcApi.DATABASE_API,
      method: 'get_dynamic_global_properties',
      params: [],
    });
  }

  public async getCurrentBlockNumber(): Promise<number> {
    const props = await this.getDynamicGlobalProperties();
    return props.head_block_number;
  }

  public async getIrreversibleBlockNumber(): Promise<number> {
    const props = await this.getDynamicGlobalProperties();
    return props.last_irreversible_block_num;
  }

  public getBlock(blockNum: number): Promise<Block> {
    return this.client.send({
      api: RpcApi.DATABASE_API,
      method: 'get_block',
      params: [blockNum],
    });
  }

  public getDiscussionsByBlog(query: DiscussionQuery): Promise<Discussion[]> {
    return this.client.send({
      api: RpcApi.DATABASE_API,
      method: 'get_discussions_by_blog',
      params: [query],
    });
  }

  public getContent(author: string,
                    permlink: string): Promise<Discussion|undefined> {
    return this.client.send({
      api: RpcApi.DATABASE_API,
      method: 'get_content',
      params: [author, permlink]
    }).then(data => (data.author && data.permlink) ? data : undefined);
  }

  public getAccounts(...accounts: string[]): Promise<Account[]> {
    return this.client.send({
      api: RpcApi.DATABASE_API,
      method: 'get_accounts',
      params: [accounts]
    });
  }
}
