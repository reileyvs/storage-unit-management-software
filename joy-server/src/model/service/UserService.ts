import { AuthToken, User, AuthTokenDto } from "joy-shared";
import { StorageDao } from "../../dao/abstract/StorageDao";
import { UserDao } from "../../dao/abstract/UserDao";
import { SessionDao } from "../../dao/abstract/SessionDao";
import { SessionDaoFactory } from "../../dao/factory/SessionDaoFactory";
import { StorageDaoFactory } from "../../dao/factory/StorageDaoFactory";
import { UserDaoFactory } from "../../dao/factory/UserDaoFactory";

const EXPIRATION_LIMIT = Date.now() - 2 * 60 * 1000

export class UserService {
  sessionDao: SessionDao
  storageDao: StorageDao
  userDao: UserDao

  constructor() {
    this.sessionDao = SessionDaoFactory.getSessionDao()
    this.storageDao = StorageDaoFactory.getStorageDao()
    this.userDao = UserDaoFactory.getUserDao()
  }

  async getUser(
    token: string,
    alias: string
  ): Promise<User | null> {
    await this.authenticate(token)
    return this.userDao.getUser(alias)
  };
  async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const user = await this.userDao.login(alias, password)

    if (user === null) {
      throw new Error("[Bad Request] Invalid alias or password");
    }
    const authToken = AuthToken.Generate()
    await this.sessionDao.put(authToken)
    return [user, authToken];
  };
    async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageUrl = await this.storageDao.storeImage(alias + "." + imageFileExtension, userImageBytes)
    const userCheck = await this.userDao.getUser(alias)
    if (userCheck != null) {
      throw new Error("[Bad Request] Alias is already taken")
    }
    const user = await this.userDao.register(firstName, lastName, alias, password, imageUrl);

    if (user === null) {
      throw new Error("[Bad Request] Invalid registration");
    }
    const authToken = AuthToken.Generate()
    await this.sessionDao.put(authToken)
    return [user, authToken];
  };
  async logout(authToken: AuthToken): Promise<void> {
    await this.sessionDao.delete(authToken.token)
    await new Promise((res) => setTimeout(res, 1000));
  };

  
  private async authenticate(token: string): Promise<boolean> {
    const session: AuthTokenDto = await this.sessionDao.get(token)
    console.log(session)
    if (session) {
      if (session.timestamp < EXPIRATION_LIMIT) {
        console.log("Expired")
        await this.sessionDao.delete(token)
        throw new Error("[Bad Request] Log back in, session expired")
      }
      await this.sessionDao.update(token, Date.now())
      console.log("Updated authtoken")
      return true;
    } else {
      console.log("Not authorized")
      throw new Error("[Bad Request] Not authorized");
    }
  }
}