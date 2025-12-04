import { ItemRequest } from "./ItemRequest";

export interface IsFollowerRequest extends ItemRequest {
  readonly followerAlias: string;
}