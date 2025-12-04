import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken, AuthTokenDto } from "joy-shared";
import { SessionDao } from "../abstract/SessionDao";

export class DynamoSessionDao implements SessionDao {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  readonly tablename = "session";
  readonly tokenAttr = "token";
  readonly timestampAttr = "timestamp";

  async get(
    token: string
  ): Promise<Record<string, AuthTokenDto | undefined> | undefined> {
    let item;
    try {
      item = await this.client.send(
        new GetCommand({
          TableName: this.tablename,
          Key: { [this.tokenAttr]: token },
        })
      );
    } catch (err) {
      throw new Error("[Server Error] Could not get session");
    }
    return item.Item;
  }
  async put(authToken: AuthToken): Promise<void> {
    // put token
    const item = {
      [this.tokenAttr]: authToken.token,
      [this.timestampAttr]: authToken.timestamp,
    };
    try {
      await this.client.send(
        new PutCommand({
          TableName: this.tablename,
          Item: item,
        })
      );
    } catch (err) {
      throw new Error("[Server Error] Could not save session");
    }
  }
  async update(token: string, timestamp: number): Promise<void> {
    try {
      await this.client.send(
        new UpdateCommand({
          TableName: this.tablename,
          Key: { [this.tokenAttr]: token },
          ExpressionAttributeNames: { "#ts": this.timestampAttr },
          ExpressionAttributeValues: { ":time": timestamp },
          UpdateExpression: "SET #ts = :time",
        })
      );
    } catch (err) {
      throw new Error("[Server Error] Could not renew session");
    }
  }
  async delete(token: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteCommand({
          TableName: this.tablename,
          Key: { [this.tokenAttr]: token },
        })
      );
    } catch (err) {
      throw new Error("[Server Error] Could not delete session");
    }
  }
}
