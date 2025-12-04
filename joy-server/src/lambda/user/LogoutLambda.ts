import { AuthToken, type AuthTokenDto, type TweeterResponse } from "joy-shared"
import { UserService } from "../../model/service/UserService.js";
export const handler = async (request: AuthTokenDto): Promise<TweeterResponse> => {
  const userService = new UserService();
  if (request === null) {
    throw new Error("Invalid logout request");
  }
  await userService.logout(AuthToken.fromDto(request)!);
  return {
    success: true,
    message: null,
  }
}