import type { RegisterRequest, AuthResponse, UserDto } from "joy-shared";
import { UserService } from "../../model/service/UserService.js";
import { AuthTokenDto } from "joy-shared/dist/model/dto/AuthTokenDto.js";
export const handler = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  const userService = new UserService();
  const [user, auth] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );
  const userDto: UserDto = user.dto;
  const authDto: AuthTokenDto = auth.dto;
  return {
    success: true,
    message: null,
    user: userDto,
    authToken: authDto,
  };
};
