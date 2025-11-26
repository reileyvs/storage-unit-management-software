import { User, AuthToken } from "joy-shared";

export interface UserInfo {
  currentUser: User | null;
  displayedUser: User | null;
  authToken: AuthToken | null;
}
