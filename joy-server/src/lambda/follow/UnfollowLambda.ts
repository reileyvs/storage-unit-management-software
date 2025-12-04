import type { FollowRequest, FollowResponse, ItemRequest } from "joy-shared"
import { FollowService } from "../../model/service/FollowService.js";
export const handler = async (request: FollowRequest): Promise<FollowResponse> => {
  const followService = new FollowService();
  const [followeeCount, followerCount] = await followService.unfollow(request.token, request.userAlias, request.displayedUser)
  
  return {
    success: true,
    message: null,
    followeeCount: followeeCount,
    followerCount: followerCount
  }
}