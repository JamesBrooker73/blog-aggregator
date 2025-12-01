import { getAllFeeds } from "src/lib/db/queries/feed";

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