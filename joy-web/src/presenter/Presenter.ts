export interface View {
  displayErrorMessage(message: string): void;
}

export interface MessageView extends View {
  displayInfoMessage(
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined
  ): string;
  deleteMessage(messageId: string): void;
}

export abstract class Presenter<V extends View> {
  private _view: V;

  protected constructor(view: V) {
    this._view = view;
  }
  async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationActionDesc: string
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationActionDesc} because of exception: ${error}`
      );
    }
  }

  protected get view() {
    return this._view;
  }
}
