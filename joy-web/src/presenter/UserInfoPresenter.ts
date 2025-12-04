import { AuthToken, User } from "joy-shared";
import { FollowService } from "../model.service/FollowService";
import { Location } from "react-router-dom";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower(follower: boolean): void;
  setFolloweeCount(count: number): void;
  setFollowerCount(count: number): void;
  setIsLoading(loading: boolean): void;
}
export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService;
  constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
  }

  followOrUnfollow = async (
    event: React.MouseEvent,
    currentUser: User | null,
    displayedUser: User | null,
    authToken: AuthToken,
    type: string,
    isFollower: boolean,
    errorType: string,
    followDecide: (
      authToken: AuthToken,
      currentUser: User,
      userToChange: User
    ) => Promise<[number, number]>
  ): Promise<void> => {
    event.preventDefault();

    var userToast = "";

    try {
      this.view.setIsLoading(true);
      userToast = this.view.displayInfoMessage(
        `${type} ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await followDecide(
        authToken!,
        currentUser!,
        displayedUser!
      );

      this.view.setIsFollower(isFollower);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${errorType} user because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(userToast);
      this.view.setIsLoading(false);
    }
  };
  followDisplayedUser = async (
    event: React.MouseEvent,
    currentUser: User | null,
    displayedUser: User | null,
    authToken: AuthToken
  ): Promise<void> => {
    this.followOrUnfollow(
      event,
      currentUser,
      displayedUser,
      authToken,
      "Following",
      true,
      "follow",
      this.follow
    )
  };
  unfollowDisplayedUser = async (
    event: React.MouseEvent,
    currentUser: User | null,
    displayedUser: User | null,
    authToken: AuthToken
  ): Promise<void> => {
    this.followOrUnfollow(
      event,
      currentUser,
      displayedUser,
      authToken,
      "Unfollowing",
      false,
      "unfollow",
      this.unfollow
    );
  };

  async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFolloweeCount(
        await this.getFolloweeCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }
  async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFollowerCount(
        await this.getFollowerCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  follow = async (
    authToken: AuthToken,
    currentUser: User,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> => {
    return this.service.follow(authToken, currentUser, userToFollow);
  }

  unfollow = async (
    authToken: AuthToken,
    currentUser: User,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> => {
    return this.service.unfollow(authToken, currentUser, userToUnfollow);
  }

  getBaseUrl(location: Location): string {
  const parts = location.pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  parts.pop();
  return parts.length === 0 ? "/" : `/${parts.join("/")}`;
}

  getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
    return this.service.getFollowerCount(authToken, user);
  }
  getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
    return this.service.getFolloweeCount(authToken, user);
  }
  getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return this.service.getIsFollowerStatus(authToken, user, selectedUser);
  }
}
