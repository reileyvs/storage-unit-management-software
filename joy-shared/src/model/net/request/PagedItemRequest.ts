import { Dto } from "../../dto/Dto.js";
import { ItemRequest } from "./ItemRequest.js";

export interface PagedItemRequest<T extends Dto> extends ItemRequest {
  readonly pageSize: number,
  readonly lastItem: T | null
}