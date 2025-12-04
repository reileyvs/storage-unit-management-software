import type { UserDto, ItemRequest, UserResponse } from "joy-shared"
import { UserService } from "../../model/service/UserService.js";
export const handler = async (request: ItemRequest): Promise<UserResponse> => {
  const userService = new UserService();
  const user = await userService.getUser(request.token, request.userAlias)
  console.log("User: " + JSON.stringify(user))
  const userDto: UserDto | null = user ? user.dto : null
  console.log("UserDto: " + JSON.stringify(userDto))
  
  return {
    success: true,
    message: null,
    user: userDto,
  }
}