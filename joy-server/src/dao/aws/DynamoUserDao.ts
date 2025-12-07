import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User, UserDto } from "joy-shared";
import { UserDao } from "../abstract/UserDao";
import bcrypt from "bcryptjs"

export class DynamoUserDao  {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  readonly tablename = "user";
  readonly firstNameAttr = "firstName";
  readonly lastNameAttr = "lastName";
  readonly aliasAttr = "alias";
  readonly passwordAttr = "password";
  readonly imageUrlAttr = "imageUrl";
  readonly followerCountAttr = "followerCount";
  readonly followeeCountAttr = "followeeCount";
  readonly followerAttr = "followerCount";
  readonly followeeAttr = "followeeCount";

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string
  ): Promise<User | null> {
    const passHash = await bcrypt.hash(password, 5)
    const item = {
      [this.firstNameAttr]: firstName,
      [this.lastNameAttr]: lastName,
      [this.aliasAttr]: alias,
      [this.passwordAttr]: passHash,
      [this.imageUrlAttr]: imageUrl,
      [this.followerAttr]: 0,
      [this.followeeAttr]: 0,
    };
    await this.client
      .send(
        new PutCommand({
          TableName: this.tablename,
          Item: item,
        })
      )
      .catch((e) => {
        throw new Error("[Server Error] Failed to put user to DynamoDB:", e);
      });
    return new User(firstName, lastName, alias, imageUrl);
  }
  async login(alias: string, password: string): Promise<User | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tablename,
        Key: { [this.aliasAttr]: alias },
      })
    ).catch((e) => {
      throw new Error("[Server Error] Could not login: ", e)
    });

    if (!result.Item) return null;

    const item = result.Item as any;
    if (!bcrypt.compareSync(password, item[this.passwordAttr])) return null;

    return User.fromDto(item as UserDto);
  }
  async getUser(userAlias: string): Promise<User | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tablename,
        Key: { [this.aliasAttr]: userAlias },
      })
    ).catch((e) => {
      throw new Error("[Server Error] Could not get user: ", e)
    });
    const item = result.Item;
    let user: User | null = null;
    user = item
      ? new User(
          item[this.firstNameAttr],
          item[this.lastNameAttr],
          item[this.aliasAttr],
          item[this.imageUrlAttr]
        )
      : null;
    console.log("Returning " + JSON.stringify(user));
    return user;
  }
  async getBatchOfUsers(
    aliases: string[]
  ): Promise<(User | undefined)[] | null> {
    if (!aliases || aliases.length === 0) return [];

    const batches: string[][] = [];
    for (let i = 0; i < aliases.length; i += 100) {
      batches.push(aliases.slice(i, i + 100));
    }
    const fetchedUsersByAlias: Record<string, User> = {};
    for (const batch of batches) {
      const keys = batch.map((a) => ({ [this.aliasAttr]: a }));

      const command = new BatchGetCommand({
        RequestItems: {
          [this.tablename]: {
            Keys: keys,
          },
        },
      });
      const data = await this.client.send(command).catch((e) => {
        throw new Error("[Server Error] Could not retrieve users: ", e)
      });
      const responses = (data as any).Responses?.[this.tablename] ?? [];
      for (const it of responses) {
        const user = new User(
          it[this.firstNameAttr],
          it[this.lastNameAttr],
          it[this.aliasAttr],
          it[this.imageUrlAttr]
        );
        fetchedUsersByAlias[it[this.aliasAttr]] = user;
      }
    }
    const result = aliases.map((a) => fetchedUsersByAlias[a]);
    return result;
  }
  async getFolloweeCount(alias: string): Promise<number> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tablename,
        Key: { [this.aliasAttr]: alias },
      })
    ).catch((e) => {
      throw new Error("[Server Error] Could not get followee count", e)
    });
    const item = result.Item;
    if (item) {
      return item[this.followeeAttr];
    } else {
      return 0;
    }
  }
  async getFollowerCount(alias: string): Promise<number> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tablename,
        Key: { [this.aliasAttr]: alias },
      })
    ).catch((e) => {
      throw new Error("[Server Error] Could not get follower count", e)
    });
    const item = result.Item;
    if (item) {
      return item[this.followerAttr];
    } else {
      return 0;
    }
  }
  async addFollower(alias: string): Promise<number> {
    try {
      const result = await this.client.send(
        new UpdateCommand({
          TableName: this.tablename,
          Key: { [this.aliasAttr]: alias },
          UpdateExpression: "SET #fc = #fc + :inc",
          ExpressionAttributeNames: { "#fc": this.followerCountAttr },
          ExpressionAttributeValues: { ":inc": 1 },
          ReturnValues: "UPDATED_NEW",
        })
      ).catch((e) => {
      throw new Error("[Server Error] Could not add follower", e)
    });
      const updated = (result as any).Attributes?.[this.followerCountAttr];
      return Number(updated ?? 0);
    } catch (e) {
      console.error("[Server Error] Failed to increment followerCount:", e);
      return 0;
    }
  }
  async addFollowee(alias: string): Promise<number> {
    try {
      const result = await this.client.send(
        new UpdateCommand({
          TableName: this.tablename,
          Key: { [this.aliasAttr]: alias },
          UpdateExpression: "SET #fc = #fc + :inc",
          ExpressionAttributeNames: { "#fc": this.followeeCountAttr },
          ExpressionAttributeValues: { ":inc": 1 },
          ReturnValues: "UPDATED_NEW",
        })
      ).catch((e) => {
      throw new Error("[Server Error] Could not add followee", e)
    });
      const updated = (result as any).Attributes?.[this.followeeCountAttr];
      return Number(updated ?? 0);
    } catch (e) {
      console.error("[Server Error] Failed to increment followeeCount:", e);
      return 0;
    }
  }
  async removeFollowee(alias: string): Promise<number> {
    try {
      const result = await this.client.send(
        new UpdateCommand({
          TableName: this.tablename,
          Key: { [this.aliasAttr]: alias },
          UpdateExpression: "SET #fc = #fc - :dec",
          ConditionExpression: "#fc >= :one",
          ExpressionAttributeNames: { "#fc": this.followeeCountAttr },
          ExpressionAttributeValues: { ":dec": 1, ":one": 1 },
          ReturnValues: "UPDATED_NEW",
        })
      ).catch((e) => {
      throw new Error("[Server Error] Could not remove followee", e)
    });
      const updated = (result as any).Attributes?.[this.followeeCountAttr];
      return Number(updated ?? 0);
    } catch (e: any) {
      if (e && e.name === "ConditionalCheckFailedException") {
        try {
          const getRes = await this.client.send(
            new GetCommand({
              TableName: this.tablename,
              Key: { [this.aliasAttr]: alias },
            })
          );
          const val = (getRes as any).Item?.[this.followeeCountAttr];
          return Number(val ?? 0);
        } catch (err) {
          console.error(
            "Failed to read followeeCount after conditional failure:",
            err
          );
          return 0;
        }
      }
      console.error("Failed to decrement followeeCount:", e);
      return 0;
    }
  }
  async removeFollower(alias: string): Promise<number> {
    try {
      const result = await this.client.send(
        new UpdateCommand({
          TableName: this.tablename,
          Key: { [this.aliasAttr]: alias },
          UpdateExpression: "SET #fc = #fc - :dec",
          ConditionExpression: "#fc >= :one",
          ExpressionAttributeNames: { "#fc": this.followerCountAttr },
          ExpressionAttributeValues: { ":dec": 1, ":one": 1 },
          ReturnValues: "UPDATED_NEW",
        })
      ).catch((e) => {
      throw new Error("[Server Error] Could not remove follower", e)
    });
      const updated = (result as any).Attributes?.[this.followerCountAttr];
      return Number(updated ?? 0);
    } catch (e: any) {
      if (e && e.name === "ConditionalCheckFailedException") {
        try {
          const getRes = await this.client.send(
            new GetCommand({
              TableName: this.tablename,
              Key: { [this.aliasAttr]: alias },
            })
          );
          const val = (getRes as any).Item?.[this.followerCountAttr];
          return Number(val ?? 0);
        } catch (err) {
          console.error(
            "[Server Error] Failed to read followerCount after conditional failure:",
            err
          );
          return 0;
        }
      }
      console.error("[Server Error] Failed to decrement followerCount:", e);
      return 0;
    }
  }
}
