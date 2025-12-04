import { DataPage } from "../aws/entity/DataPage";
import { Follows } from "../aws/entity/Follows";

export interface FollowDao {
  getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<Follows>>
  getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<Follows>>
  get(follows: Follows): Promise<any>
  put(follows: Follows): Promise<void>
  delete(follows: Follows): Promise<void>
}