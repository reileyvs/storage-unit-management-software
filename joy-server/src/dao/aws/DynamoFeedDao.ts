import { Status, StatusDto } from "joy-shared";
import { FeedDao } from "../abstract/FeedDao";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage } from "./entity/DataPage";

export class DynamoFeedDao implements FeedDao {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  readonly tablename = "feed";
  readonly timeAttr = "timestamp";
  readonly feedAttr = "post";
  readonly userAttr = "alias";

  async getBatchOfFeed(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<DataPage<StatusDto>> {
    const params = {
      KeyConditionExpression: "#alias = :ee",
      ExpressionAttributeNames: {
        "#alias": this.userAttr,
      },
      ExpressionAttributeValues: {
        ":ee": userAlias,
      },
      TableName: this.tablename,
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              [this.userAttr]: lastItem.user.alias,
              [this.timeAttr]: lastItem.timestamp,
            },
    };
    const items: StatusDto[] = [];
    let data;
    try {
      data = await this.client.send(new QueryCommand(params));
    } catch(err) {
      throw new Error("[Server Error] Could not load feed")
    }
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      if (item != null) {
        items.push(item[this.feedAttr]);
      }
    });
    return new DataPage<StatusDto>(items, hasMorePages);
  }
  async addFeedItem(post: StatusDto, follower: string): Promise<void> {
    const item = {
      [this.userAttr]: follower,
      [this.timeAttr]: post.timestamp,
      [this.feedAttr]: post,
    };
    try {
    await this.client.send(
      new PutCommand({
        TableName: this.tablename,
        Item: item,
      })
    );
  } catch(err) {
    throw new Error("[Server Error] Could not add feed item")
  }
  }
}
