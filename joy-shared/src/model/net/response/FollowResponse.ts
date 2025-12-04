import { TweeterResponse } from "./TweeterResponse";

export interface FollowResponse extends TweeterResponse {
  readonly followeeCount: number,
  readonly followerCount: number
}