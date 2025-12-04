import { UserService } from "../model.service/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";
import bcrypt from "bcryptjs"

export class LoginPresenter extends AuthPresenter {
  private service: UserService;

  public constructor(view: AuthView) {
    super(view);
    this.service = new UserService();
  }

  async doLogin(
    rememberMe: boolean,
    alias: string,
    password: string,
    originalUrl: string | undefined
  ) {
    this.doAuthenticationOperation(
      async (navLocation: string) => {
        const [user, authToken] = await this.service.login(alias, password);

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate(`${navLocation}/${user.alias}`);
        }
      },
      "/feed",
      "login user"
    );
  }
}
