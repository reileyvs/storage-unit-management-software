import { DynamoUserDao } from "../aws/DynamoUserDao";

export class UserDaoFactory {
  public static getUserDao() {
    return new DynamoUserDao()
  }
}