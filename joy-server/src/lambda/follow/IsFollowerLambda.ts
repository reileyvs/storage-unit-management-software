import type { IsFollowerRequest, BooleanResponse } from "joy-shared"
import { FollowService } from "../../model/service/FollowService.js";
export const handler = async (request: IsFollowerRequest): Promise<BooleanResponse> => {
  const followService = new FollowService();
  const isFollower = await followService.getIsFollowerStatus(request.token, request.userAlias, request.followerAlias)
  
  return {
    success: true,
    message: null,
    value: isFollower
  }
}