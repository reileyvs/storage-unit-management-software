import { User, UserDto } from "joy-shared";

export interface UserDao {
  register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string
  ): Promise<UserDto | null>;
  login(alias: string, password: string): Promise<UserDto | null>;
  get(userAlias: string): Promise<UserDto | null>;
  getList(aliases: string[]): Promise<UserDto[]>;
  getConnectionCount(alias: string): Promise<number>;
  addConnection(alias: string): Promise<number>;
  removeConnection(alias: string): Promise<number>;
}
