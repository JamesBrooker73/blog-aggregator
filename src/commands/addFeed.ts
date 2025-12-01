import { readConfig } from "src/config";
import { addUserFeed } from "src/lib/db/queries/feed";
import { getUserByName } from "src/lib/db/queries/users";
import { feeds, users } from "src/lib/db/schema";

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }

  const loggedInUser = readConfig().currentUserName;
  
  if (!loggedInUser)
  {
    throw new Error("There's not a user logged in.");
  }

  const currentUser = await getUserByName(loggedInUser);

  if (!currentUser) {
    throw new Error(`Logged in user not in database.`);
  }

  const [name, url] = args;
  const currentFeed = await addUserFeed(currentUser.id, name, url);
  if (!currentFeed) {
    throw new Error(`Failed to create feed`);
  }

  console.log("A feed has successfully been added.");
  printFeed(currentFeed, currentUser);
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}