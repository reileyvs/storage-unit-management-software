import { User } from "joy-shared";
import { FollowService } from "../model.service/FollowService";
import { PagedItemPresenter } from "./PagedItemPresenter";

export abstract class UserItemPresenter extends PagedItemPresenter<
  User,
  FollowService
> {
  protected serviceFactory(): FollowService {
    return new FollowService();
  }
}