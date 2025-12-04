import { DynamoFollowDao } from "../aws/DynamoFollowDao";

export class FollowDaoFactory {
  public static getFollowDao() {
    return new DynamoFollowDao()
  }
}