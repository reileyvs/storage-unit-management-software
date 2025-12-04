export class Follows {
  followerHandle: string;
  followeeHandle: string;

  constructor(
    followerHandle: string,
    followeeHandle: string,
  ) {
    this.followerHandle = followerHandle;
    this.followeeHandle = followeeHandle;
  }
}
