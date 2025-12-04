import { AuthToken, PostStatusRequest, Status, type AuthTokenDto, type TweeterResponse } from "joy-shared"
import { StatusService } from "../../model/service/StatusService";
export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  if (request === null) {
    throw new Error("Invalid logout request");
  }
  if (request.statusDto == null) {
    throw new Error("Invalid post status request");
  }
  await statusService.postStatus(request.token, request.statusDto);
  return {
    success: true,
    message: null,
  }
}