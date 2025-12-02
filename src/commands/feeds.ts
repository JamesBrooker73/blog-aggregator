import { readConfig } from "src/config";
import { addUserFeed, getAllFeeds } from "src/lib/db/queries/feed";
import { createFeedFollow } from "src/lib/db/queries/feed-follow";
import { getUserByName } from "src/lib/db/queries/users";
import { Feed, User} from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }

  const [name, url] = args;
  const currentFeed = await addUserFeed(user.id, name, url);
  if (!currentFeed) {
    throw new Error(`Failed to create feed`);
  }

  const feedUser = await createFeedFollow(user.id, currentFeed.id);
  console.log(`${feedUser.users.name} followed ${feedUser.feeds.name}`);

  console.log("A feed has successfully been added.");
  printFeed(currentFeed, user);
}

export async function handlerGetAllFeeds(cmdName: string, ...args: string[]) {
  const allFeeds = await getAllFeeds();
  if (allFeeds.length === 0) {
    console.log("No feeds found.");
    return;
  }

  for (const feed of allFeeds) {
    console.log(`Details:`);
    console.log(`* Name:     ${feed.feedName}`);
    console.log(`* URL:      ${feed.feedUrl}`);
    console.log(`* Added by: ${feed.username}\n`);
  }
}


function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}