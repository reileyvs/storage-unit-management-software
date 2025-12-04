import { Status, StatusDto } from "joy-shared";
import { DataPage } from "../aws/entity/DataPage";

export interface StoryDao {
  getBatchOfStories(userAlias: string, pageSize: number, lastItem: Status | undefined): Promise<DataPage<Status>>
  addStory(status: StatusDto): Promise<void>
}