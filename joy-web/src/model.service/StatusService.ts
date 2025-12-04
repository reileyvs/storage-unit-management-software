import { AuthToken, Status, StatusDto, PagedItemRequest, PostStatusRequest } from "joy-shared";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService {
  private facade: ServerFacade = new ServerFacade();
  async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = this.createPagedRequest(authToken, userAlias, pageSize, lastItem);
    return await this.facade.loadMoreStatusItems(request, "/status/feed/list", "feeds");
  };
  async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = this.createPagedRequest(authToken, userAlias, pageSize, lastItem);
    return await this.facade.loadMoreStatusItems(request, "/status/story/list", "stories");
  };
  async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const request: PostStatusRequest = {
      token: authToken.token,
      statusDto: newStatus.dto
    }
    return this.facade.postStatus(request);
  };
  createPagedRequest(
      token: AuthToken,
      userAlias: string,
      pageSize: number,
      lastUser: Status | null
    ): PagedItemRequest<StatusDto> {
      const lastUserDto = lastUser ? lastUser.dto : null;
      return {
        token: token.token,
        userAlias,
        pageSize,
        lastItem: lastUserDto,
      };
    }
}