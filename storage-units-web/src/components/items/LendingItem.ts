import { JoyItem } from "./JoyItem";

export class LendingItem extends JoyItem {
  private _lendingDays: number
  constructor(imageUrl: string, title: string, description: string, lendingDays: number) {
    super(imageUrl, title, description)
    this._lendingDays = lendingDays
  }
  public get lendingDays() {
    return this._lendingDays
  }
}