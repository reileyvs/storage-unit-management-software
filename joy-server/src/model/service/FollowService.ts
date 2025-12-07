import { Follow, User, type UserDto } from "joy-shared";
import { UserDao } from "../../dao/abstract/UserDao";
import { SessionDao } from "../../dao/abstract/SessionDao";
import { FollowDao } from "../../dao/abstract/FollowDao";
import { UserDaoFactory } from "../../dao/factory/UserDaoFactory";
import { SessionDaoFactory } from "../../dao/factory/SessionDaoFactory";
import { FollowDaoFactory } from "../../dao/factory/FollowDaoFactory";
import { Follows } from "../../dao/aws/entity/Follows";

const EXPIRATION_LIMIT = Date.now() - 60 * 1000

export class FollowService {
  userDao: UserDao;
  sessionDao: SessionDao;
  followDao: FollowDao;
  constructor() {
    //call factory functions
    this.userDao = UserDaoFactory.getUserDao();
    this.sessionDao = SessionDaoFactory.getSessionDao();
    this.followDao = FollowDaoFactory.getFollowDao();
  }

  async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastUser: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authenticate(token)
    const page = await this.followDao.getPageOfFollowees(userAlias, pageSize, lastUser?.alias)
    let users = await this.userDao.getList(page.values.map(value => value.followeeHandle))
    if (!users) {
      users = []
    } else {
      users = users.filter(user => user != undefined) as UserDto[]
    }
    return [users ? users : [], page.hasMorePages];
  }
  async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastUser: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authenticate(token)
    const page = await this.followDao.getPageOfFollowers(userAlias, pageSize, lastUser?.alias)
    let users = await this.userDao.getList(page.values.map(value => value.followerHandle))
    if (!users) {
      users = []
    } else {
      users = users.filter(user => user != undefined) as UserDto[]
    }
    return [users ? users : [], page.hasMorePages];
  }
  async getConnectionCount(token: string, userAlias: string): Promise<number> {
    await this.authenticate(token)
    return this.userDao.getConnectionCount(userAlias)
  }
  async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    await this.authenticate(token)
    const follower = await this.followDao.get(new Follows(userAlias, selectedUserAlias))
    return !!follower
  }
  async follow(
    token: string,
    currentUser: string,
    userToFollow: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    
    await this.authenticate(token)
    await this.followDao.put(new Follows(currentUser, userToFollow))
    await this.userDao.addConnection(currentUser)
    await this.userDao.addConnection(userToFollow)

    const followerCount = await this.getConnectionCount(token, userToFollow);
    const followeeCount = await this.getConnectionCount(token, userToFollow);

    return [followerCount, followeeCount];
  }
  async unfollow(
    token: string,
    currentUser: string,
    userToUnfollow: string
  ): Promise<[followerCount: number, followeeCount: number]> {

    await this.authenticate(token)
    const unfollow = new Follows(currentUser, userToUnfollow)
    await this.followDao.delete(unfollow)

    const followerCount = await this.userDao.removeConnection(currentUser)
    const followeeCount = await this.userDao.removeConnection(userToUnfollow)

    return [followerCount, followeeCount];
  }

  private async authenticate(token: string): Promise<boolean> {
    const session = await this.sessionDao.get(token)
    if (session) {
      if (session.timestamp < EXPIRATION_LIMIT) {
        await this.sessionDao.delete(token)
        throw new Error("[Bad Request] Log back in, session expired")
      }
      await this.sessionDao.update(token, Date.now())
      return true;
    } else {
      throw new Error("[Bad Request] Not authorized");
    }
  }
}
