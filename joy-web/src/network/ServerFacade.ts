import {
  AuthResponse,
  AuthToken,
  AuthTokenDto,
  BooleanResponse,
  FollowResponse,
  IsFollowerRequest,
  LoginRequest,
  PagedItemRequest,
  PagedItemResponse,
  RegisterRequest,
  TweeterResponse,
  User,
  UserCountResponse,
  UserDto,
  ItemRequest,
  UserResponse,
  StatusDto,
  Status,
  PostStatusRequest,
  FollowRequest,
} from "joy-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://bwy06znwj8.execute-api.us-east-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollows(
    request: PagedItemRequest<UserDto>,
    path: "/follower/list" | "/followee/list",
    type: "followers" | "followees"
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(request, path);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto: UserDto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    this.errorCheck(response);
    if (items == null) {
      throw new Error(`No ${type} found`);
    } else {
      return [items, response.hasMore];
    }
  }
  public async getFollowCount(request: ItemRequest, type: "followee" | "follower"): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      ItemRequest,
      UserCountResponse
    >(request, `/${type}/count`);
    this.errorCheck(response);
    return response.count;
  }
  public async isFollower(request: IsFollowerRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      BooleanResponse
    >(request, "/follower/confirm");
    this.errorCheck(response);
    return response.value;
  }
  public async changeFollowStatus(
    request: FollowRequest,
    path: "/follow" | "/unfollow"
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, path);
    this.errorCheck(response);
    return [response.followerCount, response.followeeCount];
  }
  public async getUser(request: ItemRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      ItemRequest,
      UserResponse
    >(request, "/user/get");
    this.errorCheck(response);
    if (response.user == null) {
      console.log("User not found");
    } else {
      console.log("User found");
    }
    return response.user ? User.fromDto(response.user) : null;
  }
  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthResponse
    >(request, "/login");
    this.errorCheck(response);
    if (response.user == null || response.authToken == null) {
      throw new Error("No user or auth token found.");
    } else {
      return [
        User.fromDto(response.user)!,
        AuthToken.fromDto(response.authToken)!,
      ];
    }
  }
  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<RegisterRequest, AuthResponse>(
      request, "/register"
    );
    this.errorCheck(response);
    if (response.user == null || response.authToken == null) {
      throw new Error("No user or auth token found.");
    } else {
      return [
        User.fromDto(response.user)!,
        AuthToken.fromDto(response.authToken)!,
      ];
    }
  }
  public async logout(request: AuthToken): Promise<void> {
    const requestDto = request.dto;
    const response = await this.clientCommunicator.doPost<AuthTokenDto, TweeterResponse>(
      requestDto, "/logout"
    )
    this.errorCheck(response);
  }
  public async loadMoreStatusItems(request: PagedItemRequest<StatusDto>, path: string, type: "stories" | "feeds"): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
    PagedItemRequest<StatusDto>,
    PagedItemResponse<StatusDto>
    >(request, path);
    this.errorCheck(response);

    const items: Status[] | null =
      response.items
        ? response.items.map((dto: StatusDto) => Status.fromDto(dto) as Status)
        : null;
    if (items == null) {
      throw new Error(`No ${type} found`);
    } else {
      return [items, response.hasMore];
    }
  }
  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(
      request, "/status/post"
    );
    this.errorCheck(response);
  }
  public errorCheck(response: TweeterResponse): boolean {
    if (response.success) {
      return true;
    } else {
      if(response.message){
        const err = JSON.parse(response.message!) as Error
        throw new Error(err.message ?? undefined);
      } else {
        throw new Error("Bad")
      }
    }
  }
  
}
