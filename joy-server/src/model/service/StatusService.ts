import { Status, StatusDto } from "joy-shared";
import { SessionDao } from "../../dao/abstract/SessionDao";
import { FeedDao } from "../../dao/abstract/FeedDao";
import { StoryDao } from "../../dao/abstract/StoryDao";
import { SessionDaoFactory } from "../../dao/factory/SessionDaoFactory";
import { FeedDaoFactory } from "../../dao/factory/FeedDaoFactory";
import { StoryDaoFactory } from "../../dao/factory/StoryDaoFactory";
import { FollowDaoFactory } from "../../dao/factory/FollowDaoFactory";
import { FollowDao } from "../../dao/abstract/FollowDao";

const EXPIRATION_LIMIT = Date.now() - 60 * 1000

export class StatusService {
  sessionDao: SessionDao;
  feedDao: FeedDao;
  storyDao: StoryDao;
  followDao: FollowDao;

  constructor() {
    this.sessionDao = SessionDaoFactory.getSessionDao();
    this.feedDao = FeedDaoFactory.getFeedDao();
    this.storyDao = StoryDaoFactory.getStoryDao();
    this.followDao = FollowDaoFactory.getFollowDao();
  }

  async loadMoreFeedItems(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authenticate(authToken)
    const page = await this.feedDao.getBatchOfFeed(userAlias, pageSize, lastItem);
    return [page.values, page.hasMorePages]
  }
  async loadMoreStoryItems(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    await this.authenticate(authToken)
    const page = await this.storyDao.getBatchOfStories(userAlias, pageSize, lastItem === null ? undefined : lastItem)

    return [page.values, page.hasMorePages]
  }
  async postStatus(authToken: string, newStatus: StatusDto): Promise<void> {
    await this.authenticate(authToken)
    await this.storyDao.addStory(newStatus)
    let hasMore = true
    let count = 0
    while(hasMore) {
      const page = await this.followDao.getPageOfFollowers(newStatus.user.alias, 100, undefined)
      for (const follow of page.values) {
        await this.feedDao.addFeedItem(newStatus, follow.followerHandle)
      }
      if(!page.hasMorePages) {
        hasMore = false
      }
      if(count > 100) {
        break
      }
    }
  }

  private async authenticate(token: string): Promise<boolean> {
    const session = await this.sessionDao.get(token)
    if (session) {
      if (session.timestamp < EXPIRATION_LIMIT) {
        await this.sessionDao.delete(token)
        throw new Error("[Bad Request] Log back in, session expired")
      }
      await this.sessionDao.update(token, Date.now())
      return true;
    } else {
      throw new Error("[Bad Request] Not authorized");
    }
  }
}
