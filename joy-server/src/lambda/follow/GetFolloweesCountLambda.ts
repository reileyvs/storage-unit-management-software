import type { ItemRequest, UserCountResponse } from "joy-shared"
import { FollowService } from "../../model/service/FollowService.js";
export const handler = async (request: ItemRequest): Promise<UserCountResponse> => {
  const followService = new FollowService();
  const followeeCount = await followService.getFolloweeCount(request.token, request.userAlias)
  
  return {
    success: true,
    message: null,
    count: followeeCount
  }
}