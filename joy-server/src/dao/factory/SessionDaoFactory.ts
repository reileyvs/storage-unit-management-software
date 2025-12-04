import { DynamoSessionDao } from "../aws/DynamoSessionDao";

export class SessionDaoFactory {
  public static getSessionDao() {
    return new DynamoSessionDao()
  }
}