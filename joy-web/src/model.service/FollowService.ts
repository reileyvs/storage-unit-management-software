import {
  AuthToken,
  User,
  PagedItemRequest,
  ItemRequest,
  IsFollowerRequest,
  UserDto,
  FollowRequest,
} from "joy-shared";
import { ServerFacade } from "../network/ServerFacade";
export class FollowService {
  facade: ServerFacade = new ServerFacade();

  async loadMoreFollowees(
    token: AuthToken,
    userAlias: string,
    pageSize: number,
    lastUser: User | null
  ): Promise<[User[], boolean]> {
    const itemRequest = this.createPagedRequest(
      token,
      userAlias,
      pageSize,
      lastUser
    );
    const [users, hasMore] = await this.facade.getMoreFollows(itemRequest, "/followee/list", "followees");
    return [users, hasMore];
  }
  async loadMoreFollowers(
    token: AuthToken,
    userAlias: string,
    pageSize: number,
    lastUser: User | null
  ): Promise<[User[], boolean]> {
    const itemRequest = this.createPagedRequest(
      token,
      userAlias,
      pageSize,
      lastUser
    );
    const [users, hasMore] = await this.facade.getMoreFollows(itemRequest, "/follower/list", "followers");
    return [users, hasMore];
  }
  async getFollowerCount(token: AuthToken, user: User): Promise<number> {
    const itemRequest = this.createUserRequest(token, user);
    return this.facade.getFollowCount(itemRequest, "follower");
  }
  async getFolloweeCount(token: AuthToken, user: User): Promise<number> {
    const itemRequest = this.createUserRequest(token, user);
    return this.facade.getFollowCount(itemRequest, "followee");
  }
  async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request: IsFollowerRequest = {
      token: authToken.token,
      userAlias: user.alias,
      followerAlias: selectedUser.alias
    }
    return this.facade.isFollower(request);
  }
  async follow(
    token: AuthToken,
    currentUser: User,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowRequest = {
      token: token.token,
      userAlias: currentUser.alias,
      displayedUser: userToFollow.alias,
    }
    const [followerCount, followeeCount] = await this.facade.changeFollowStatus(request, "/follow")
    return [followerCount, followeeCount];
  }
  async unfollow(
    token: AuthToken,
    currentUser: User,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowRequest = {
      token: token.token,
      userAlias: currentUser.alias,
      displayedUser: userToUnfollow.alias
    }
    const [followerCount, followeeCount] = await this.facade.changeFollowStatus(request, "/unfollow")
    return [followerCount, followeeCount];
  }
  createUserRequest(token: AuthToken, user: User): ItemRequest {
    return {
      token: token.token,
      userAlias: user.alias,
    };
  }
  createPagedRequest(
    token: AuthToken,
    userAlias: string,
    pageSize: number,
    lastUser: User | null
  ): PagedItemRequest<UserDto> {
    const lastUserDto = lastUser ? lastUser.dto : null;
    return {
      token: token.token,
      userAlias,
      pageSize,
      lastItem: lastUserDto,
    };
  }
}
