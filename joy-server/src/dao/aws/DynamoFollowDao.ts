import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage } from "./entity/DataPage";
import { Follows } from "./entity/Follows";
import { FollowDao } from "../abstract/FollowDao";

export class DynamoFollowDao implements FollowDao {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followerAttr = "follower_handle";
  readonly followeeAttr = "followee_handle";

  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<Follows>> {
    const params = {
      KeyConditionExpression: this.followeeAttr + " = :ee",
      ExpressionAttributeValues: {
        ":ee": followeeHandle,
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowerHandle === undefined
          ? undefined
          : {
              [this.followerAttr]: lastFollowerHandle,
              [this.followeeAttr]: followeeHandle,
            },
    };
    const items: Follows[] = [];
    let data;
    try {
      data = await this.client.send(new QueryCommand(params));
    } catch (err) {
      throw new Error("[Server Error] Could not load followers");
    }
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      items.push(new Follows(item[this.followerAttr], item[this.followeeAttr]));
    });
    return new DataPage<Follows>(items, hasMorePages);
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<Follows>> {
    const params = {
      KeyConditionExpression: this.followerAttr + " = :er",
      ExpressionAttributeValues: {
        ":er": followerHandle,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFolloweeHandle === undefined
          ? undefined
          : {
              [this.followerAttr]: followerHandle,
              [this.followeeAttr]: lastFolloweeHandle,
            },
    };
    const items: Follows[] = [];
    let data;
    try {
      data = await this.client.send(new QueryCommand(params));
    } catch (err) {
      throw new Error("[Server Error] Could not load followees");
    }
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      items.push(new Follows(item[this.followerAttr], item[this.followeeAttr]));
    });
    return new DataPage<Follows>(items, hasMorePages);
  }

  async put(follows: Follows): Promise<void> {
    const item = {
      [this.followerAttr]: follows.followerHandle,
      [this.followeeAttr]: follows.followeeHandle,
    };
    try {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
    } catch(err) {
      throw new Error("[Server Error] Could not add relationship")
    }
  }

  async get(follows: Follows): Promise<any> {
    let result;
    try {
    result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          [this.followerAttr]: follows.followerHandle,
          [this.followeeAttr]: follows.followeeHandle,
        },
      })
    );
    } catch(err) {
      throw new Error("[Server Error] Could not get relationship")
    }

    return result.Item;
  }

  async update(
    follows: Follows,
    updates: Partial<{
      follower_handle: string;
      follower_name: string;
      followee_handle: string;
      followee_name: string;
    }>
  ): Promise<void> {
    const updateExpressions = [];
    const expressionAttributeValues: Record<string, any> = {};

    for (const [key, value] of Object.entries(updates)) {
      updateExpressions.push(`${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = value;
    }
    try {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          [this.followerAttr]: follows.followerHandle,
          [this.followeeAttr]: follows.followeeHandle,
        },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );
    } catch(err) {
      throw new Error("[Server Error] Could not update relationship")
    }
  }

  async delete(follows: Follows): Promise<void> {
    try {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          [this.followerAttr]: follows.followerHandle,
          [this.followeeAttr]: follows.followeeHandle,
        },
      })
    );
    } catch(err) {
      throw new Error("[Server Error] Could not delete relationship")
    }
  }
}
