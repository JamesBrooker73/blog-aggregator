import { createFeedFollow, getFeedFollowsForUser, unfollowFeed} from "src/lib/db/queries/feed-follow";
import { getFeedID } from "src/lib/db/queries/feed";
import { User} from "src/lib/db/schema";

export async function handlerFollowFeed(cmdName: string, user: User, ...args: string[]) { 
  if (args.length != 1) {
    throw new Error("A url is required to follow a feed.");
  }

  const url = args[0];
  const feed = await getFeedID(url);
  if (!feed) {
    throw new Error(`Feed not found: ${url}`);
  }
  
  const feedUser = await createFeedFollow(user.id, feed.id);
  console.log(`${feedUser.users.name} followed ${feedUser.feeds.name}`);
}

export async function handlerUserFeeds(cmdName: string, user: User, ...args: string[]) { 
  const userFeeds = await getFeedFollowsForUser(user.id);

  if (userFeeds.length === 0) {
    console.log(`${user.name} is not following any feeds.`);
    return;
  }

  console.log(`${user.name} is following the following feeds:`);
  for (const feed of userFeeds) {
    console.log(`* ${feed.feeds.name}`);
  }
}

export async function handlerUnfollowUserFeed(cmdName: string, user: User, ...args: string[]) {
  if (args.length != 1) {
    throw new Error("A url is required to unfollow a feed.");
  }

  const url = args[0];
  const feed = (await getFeedID(url));
  
  if (!feed) {
    throw new Error("Feed not found.");
  }

  await unfollowFeed(user.id, feed.id);
  console.log(`${user.name} unfollowed ${feed.name}`);
}