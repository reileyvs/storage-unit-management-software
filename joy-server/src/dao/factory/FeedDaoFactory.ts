import { DynamoFeedDao } from "../aws/DynamoFeedDao";

export class FeedDaoFactory {
  public static getFeedDao() {
    return new DynamoFeedDao()
  }
}