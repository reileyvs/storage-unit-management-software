import type { GivingItem } from "./items/GivingItem";
import type { JoyItem } from "./items/JoyItem";
import type { LendingItem } from "./items/LendingItem";

export class User {
  //User will have personal information which should stay secure, an arrray of Giving and an array of Lending items
  private _firstName: string
  private _lastName: string
  private _userName: string
  private _givingItems: GivingItem[] = []
  private _lendingItems: LendingItem[] = []

  constructor(firstName: string, lastName: string, userName: string) {
    this._firstName = firstName
    this._lastName = lastName
    this._userName = userName
  }

  addGivingItem(item: GivingItem) {
    this._givingItems.push(item)
  }
  addLendingItem(item: LendingItem) {
    this._lendingItems.push(item)
  }

  get firstName() {
    return this._firstName
  }

  get lastName() {
    return this._lastName
  }

  get userName() {
    return this._userName
  }

  get givingItems() {
    return this._givingItems
  }
  get lendingItems() {
    return this._lendingItems
  }
  
}