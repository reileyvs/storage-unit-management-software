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
    const users = await this.userDao.getBatchOfUsers(page.values.map(value => value.followeeHandle))
    const dtos = users ? users.map((user: User | undefined) => user!.dto) : [];
    return [dtos, page.hasMorePages];
  }
  async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastUser: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authenticate(token)
    const page = await this.followDao.getPageOfFollowers(userAlias, pageSize, lastUser?.alias)
    const users = await this.userDao.getBatchOfUsers(page.values.map(value => value.followerHandle))
    const dtos = users ? users.map((user: User | undefined) => user!.dto) : [];
    return [dtos, page.hasMorePages];
  }
  async getFollowerCount(token: string, userAlias: string): Promise<number> {
    await this.authenticate(token)
    return this.userDao.getFollowerCount(userAlias)
  }
  async getFolloweeCount(token: string, userAlias: string): Promise<number> {
    await this.authenticate(token)
    return this.userDao.getFolloweeCount(userAlias)
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
    await this.userDao.addFollowee(currentUser)
    await this.userDao.addFollower(userToFollow)

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

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
    await this.userDao.removeFollowee(currentUser)
    await this.userDao.removeFollower(userToUnfollow)

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

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
