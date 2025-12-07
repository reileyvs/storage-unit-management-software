import { DynamoUserDao } from "../aws/DynamoUserDao";
import { SupaUserDao } from "../supabase/SupaUserDao";

export class UserDaoFactory {
  public static getUserDao() {
    return new SupaUserDao()
  }
}