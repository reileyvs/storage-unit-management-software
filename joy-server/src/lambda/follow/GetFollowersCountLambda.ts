import type { ItemRequest, UserCountResponse } from "joy-shared"
import { FollowService } from "../../model/service/FollowService.js";
export const handler = async (request: ItemRequest): Promise<UserCountResponse> => {
  const followService = new FollowService();
  const followerCount = await followService.getFollowerCount(request.token, request.userAlias)
  
  return {
    success: true,
    message: null,
    count: followerCount
  }
}