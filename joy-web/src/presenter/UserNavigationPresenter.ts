import { AuthToken, User } from "joy-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  extractAlias(value: string): string,
  navigate(path: string): void,
  setDisplayedUser: (user: User) => void
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private service: UserService;
  constructor(view: UserNavigationView) {
    super(view);
    this.service = new UserService();
  }

  getUser(authToken: AuthToken, alias: string) {
    return this.service.getUser(authToken, alias)
  }
  async navigateToUser(event: React.MouseEvent, featurePath: string, displayedUser: User, authToken: AuthToken) {
    this.doFailureReportingOperation(async () => {
      const target = event.currentTarget as HTMLElement | null;
      const text = target ? (target.textContent ?? "") : "";
      const alias = this.view.extractAlias(text);

      const toUser = await this.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    }, "navigate to user")
  }
}