import { DynamoStoryDao } from "../aws/DynamoStoryDao";

export class StoryDaoFactory {
  public static getStoryDao() {
    return new DynamoStoryDao()
  }
}