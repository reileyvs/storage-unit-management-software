import { Status, StatusDto, User } from "joy-shared";
import { DataPage } from "../aws/entity/DataPage";

export interface FeedDao {
  getBatchOfFeed(userAlias: string, pageSize: number, lastItem: Status | null): Promise<DataPage<StatusDto>>
  addFeedItem(post: StatusDto, follower: string): Promise<void>
}