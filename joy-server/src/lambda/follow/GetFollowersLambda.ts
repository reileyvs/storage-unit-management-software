import type { PagedItemRequest, PagedItemResponse, UserDto } from "joy-shared"
import { FollowService } from "../../model/service/FollowService.js";
export const handler = async (request: PagedItemRequest<UserDto>): Promise<PagedItemResponse<UserDto>> => {
  const followService = new FollowService();
  const [items, hasMore] = await followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem)
  
  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore
  }
}