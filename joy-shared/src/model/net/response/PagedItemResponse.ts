import { Dto } from "../../dto/Dto";
import { TweeterResponse } from "./TweeterResponse";

export interface PagedItemResponse<T extends Dto> extends TweeterResponse {
  readonly items: T[] | null,
  readonly hasMore: boolean
}