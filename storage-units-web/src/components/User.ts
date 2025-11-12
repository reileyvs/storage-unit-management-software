import type { GivingItem } from "./items/GivingItem";
import type { LendingItem } from "./items/LendingItem";
import { UserInfo } from "./UserInfo";

export class User {
  //User will have personal information which should stay secure, an arrray of Giving and an array of Lending items
  userInfo: UserInfo
  givingItems: GivingItem[] = []
  lendingItems: LendingItem[] = []

  constructor(userInfo: UserInfo) {
    this.userInfo = userInfo
  }

  
}