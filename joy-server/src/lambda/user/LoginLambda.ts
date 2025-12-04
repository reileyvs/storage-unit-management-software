import type { LoginRequest, AuthResponse, UserDto } from "joy-shared"
import { UserService } from "../../model/service/UserService.js";
import { AuthTokenDto } from "joy-shared/dist/model/dto/AuthTokenDto.js";
export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
  const userService = new UserService();
  const [user, auth] = await userService.login(request.userAlias, request.password)
  const userDto: UserDto = user.dto
  const authDto: AuthTokenDto = auth.dto
  return {
    success: true,
    message: null,
    user: userDto,
    authToken: authDto
  }
}