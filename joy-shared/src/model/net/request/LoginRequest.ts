import { TweeterRequest } from "./TweeterRequest";

export interface LoginRequest extends TweeterRequest {
  userAlias: string;
  password: string;
}