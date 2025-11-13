import { JoyItem } from "./JoyItem";


export class GivingItem extends JoyItem {
  private _daysBeforeRemoval: number
  constructor(imageUrl: string, title: string, description: string, daysBeforeRemoval: number) {
    super(imageUrl, title, description)
    this._daysBeforeRemoval = daysBeforeRemoval
  }
  public get daysBeforeRemoval() {
    return this._daysBeforeRemoval
  }
}