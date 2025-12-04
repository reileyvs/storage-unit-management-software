import { Status, StatusDto } from "joy-shared";
import { StoryDao } from "../abstract/StoryDao";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage } from "./entity/DataPage";

export class DynamoStoryDao implements StoryDao {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  readonly tableName = "story";
  readonly timeAttr = "timestamp";
  readonly storyAttr = "status";
  readonly userAttr = "alias";

  async getBatchOfStories(
    userAlias: string,
    pageSize: number,
    lastItem: Status | undefined
  ): Promise<DataPage<Status>> {
    const params = {
      KeyConditionExpression: "#alias = :ee",
      ExpressionAttributeNames: {
        "#alias": this.userAttr,
      },
      ExpressionAttributeValues: {
        ":ee": userAlias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey:
        lastItem === undefined
          ? undefined
          : {
              [this.userAttr]: lastItem.user.alias,
              [this.timeAttr]: lastItem.timestamp,
            },
    };
    const items: Status[] = [];
    let data
    try {
    data = await this.client.send(new QueryCommand(params));
    } catch(err) {
      throw new Error("[Server Error] Could not load stories")
    }
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      if (item != null) {
        items.push(Status.fromDto(item[this.storyAttr])!);
      }
    });
    return new DataPage<Status>(items, hasMorePages);
  }
  async addStory(status: StatusDto): Promise<void> {
    const item = {
      [this.userAttr]: status.user.alias,
      [this.timeAttr]: status.timestamp,
      [this.storyAttr]: status,
    };
    try {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
  } catch(err) {
      throw new Error("[Server Error] Could not post story")
    }
  }
}
