import { ItemRequest } from "./ItemRequest";

export interface FollowRequest extends ItemRequest {
  readonly displayedUser: string
}