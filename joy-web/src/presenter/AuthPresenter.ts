import { User, AuthToken } from "joy-shared";
import { Presenter, View } from "./Presenter";

export interface AuthView extends View {
  setIsLoading(loading: boolean): void;
    updateUserInfo(
      loggedInUser: User,
      displayedUser: User,
      authToken: AuthToken,
      rememberMe: boolean
    ): void;
    navigate(path: string): void;
}

export class AuthPresenter extends Presenter<AuthView> {
  constructor(view: AuthView) {
    super(view);
  }

  async doAuthenticationOperation(
    operation: (navLocation: string) => Promise<void>,
    navLocation: string,
    operationDesc: string
  ) {
    try {
      this.view.setIsLoading(true);
      await operation(navLocation);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to ${operationDesc}: ${error}`);
    } finally {
      this.view.setIsLoading(false);
    }
  }
}