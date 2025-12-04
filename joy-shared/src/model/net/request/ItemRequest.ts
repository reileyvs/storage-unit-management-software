import { TweeterRequest } from "./TweeterRequest";

export interface ItemRequest extends TweeterRequest {
  readonly userAlias: string;
}