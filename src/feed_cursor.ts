import {Client} from './client';
import {Discussion, DiscussionQuery} from './database';

export class FeedCursor {

  public readonly client: Client;
  public readonly data: Discussion[];
  public readonly opts: DiscussionQuery;

  public static get(client: Client,
                    opts: DiscussionQuery): Promise<FeedCursor|null> {
    if (opts.start_permlink) {
      // Compensate the limit count from the duplicated first result
      opts.limit++;
    }
    return client.db.getDiscussionsByBlog(opts).then((data) => {
      if (data.length === 0) {
        return null;
      } else if (opts.start_permlink
                  && data[0].permlink === opts.start_permlink
                  && data[0].author === opts.start_author) {
        // Remove duplicate result caused by the start permlink, the check is
        // necessary in case the steemit API changes in the future to remove
        // the starting result
        data.shift();
        if (data.length === 0) {
          return null;
        }
      }

      const lastDiscussion = data[data.length - 1];
      opts.start_author = lastDiscussion.author;
      opts.start_permlink = lastDiscussion.permlink;
      return new FeedCursor(client, data, opts);
    });
  }

  constructor(client: Client, data: Discussion[], opts: DiscussionQuery) {
    this.client = client;
    this.data = data;
    this.opts = opts;
  }

  public next(limit = 15): Promise<FeedCursor|null> {
    return FeedCursor.get(this.client, {
      ...this.opts,
      limit
    });
  }
}
