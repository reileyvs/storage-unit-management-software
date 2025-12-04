import { AuthToken, Status, User } from "joy-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (loading: boolean) => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _service: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this._service = new StatusService();
  }

  public get service() {
    return this._service;
  }

  async submitPost(
    event: React.MouseEvent,
    post: string,
    currentUser: User | null,
    authToken: AuthToken | null
  ) {
    var postingStatusToastId = "";

    try {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        2000
      );

      const status = new Status(post, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to post status: ${error}`);
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }
  }

  clearPost(event: React.MouseEvent) {
    event.preventDefault();
    this.view.setPost("");
  }
}
