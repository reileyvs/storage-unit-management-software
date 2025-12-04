import { User } from "joy-shared";

export interface UserDao {
  register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string
  ): Promise<User | null>;
  login(alias: string, password: string): Promise<User | null>;
  getUser(userAlias: string): Promise<User | null>;
  getBatchOfUsers(aliases: string[]): Promise<(User | undefined)[] | null>;
  getFolloweeCount(alias: string): Promise<number>;
  getFollowerCount(alias: string): Promise<number>;
  addFollower(alias: string): Promise<number>;
  addFollowee(alias: string): Promise<number>;
  removeFollower(alias: string): Promise<number>;
  removeFollowee(alias: string): Promise<number>;
}
