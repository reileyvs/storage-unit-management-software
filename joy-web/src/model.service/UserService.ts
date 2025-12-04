import { Buffer } from "buffer";
import { AuthToken, User, ItemRequest, LoginRequest, RegisterRequest } from "joy-shared";
import { ServerFacade } from "../network/ServerFacade";

export class UserService {
  facade: ServerFacade = new ServerFacade();

  async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const request: ItemRequest = {
      token: authToken.token,
      userAlias: alias
    }
    return await this.facade.getUser(request);
  };
  async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server
    const request: LoginRequest = {
      token: "",
      userAlias: alias,
      password: password
    }
    const [user, authToken] = await this.facade.login(request);
    if (user === null) {
      throw new Error("Invalid alias or password");
    }
    return [user, authToken];
  };
    async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");
    const request: RegisterRequest = {
      token: "",
      firstName: firstName,
      lastName,
      alias,
      password,
      userImageBytes: imageStringBase64,
      imageFileExtension
    }
    const [user, authToken] = await this.facade.register(request);

    if (user === null || authToken === null) {
      throw new Error("Invalid registration");
    }

    return [user, authToken];
  };
  async logout(authToken: AuthToken): Promise<void> {
    await this.facade.logout(authToken);
  };
}