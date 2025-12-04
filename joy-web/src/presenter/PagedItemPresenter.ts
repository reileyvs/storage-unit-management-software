import { AuthToken, User } from "joy-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
  addItems(newItems: T[]): void;
}

export abstract class PagedItemPresenter<T, U> extends Presenter<
  PagedItemView<T>
> {
  private _hasMoreItems = true;
  private _lastItem: T | null = null;
  private userService: UserService;
  private _service: U;

  protected constructor(view: PagedItemView<T>) {
    super(view);
    this.userService = new UserService();
    this._service = this.serviceFactory();
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  async loadMoreItems(authToken: AuthToken, alias: string) {
    this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken, alias);

      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    }, this.itemDescription());
  }

  protected abstract itemDescription(): string;
  protected abstract serviceFactory(): U;
  protected abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>;

  async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  protected get service() {
    return this._service;
  }
  protected get lastItem() {
    return this._lastItem;
  }
  protected set lastItem(item: T | null) {
    this._lastItem = item;
  }
  public get hasMoreItems() {
    return this._hasMoreItems;
  }
  protected set hasMoreItems(hasMore: boolean) {
    this._hasMoreItems = hasMore;
  }
}
