import { getNextFeedToFetch, markFeedFecthed } from "src/lib/db/queries/feed";
import { createPost } from "src/lib/db/queries/posts";
import { Feed, NewPost } from "src/lib/db/schema";
import { fetchFeed } from "src/lib/rss";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length != 1) {
    throw new Error("Parameter missing.");
  }
  const timeArg = args[0];
  const timeBetweenRequests = parseDuration(timeArg);

  if (!timeBetweenRequests) {
    throw new Error("Could not parse number correctly");
  }

  console.log(`Collecting feeds every ${timeArg}...`);

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  
  await new Promise<void>((resolve) => {
  process.on("SIGINT", () => {
    console.log("Shutting down feed aggregator...");
    clearInterval(interval);
    resolve();
    });
  });
  
   
}

export async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch();
  if (!nextFeed) {
    console.log("No feeds to fetch.")
    return;
  }
  console.log("Found a feed to fetch")
  scrapeFeed(nextFeed);
  
}

async function scrapeFeed(feed: Feed) {
  await markFeedFecthed(feed.id);
  const feedData = await fetchFeed(feed.url);

  for (let item of feedData.channel.item) {
    console.log(`Found post: %s`, item.title);

    const now = new Date();

    await createPost({
      url: item.link,
      feed_id: feed.id,
      title: item.title,
      createdAt: now,
      updatedAt: now,
      description: item.description,
      published_at: new Date(item.pubDate),
    } satisfies NewPost);
  }

  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
  );
}

function parseDuration(durationStr: string) {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) return;

  if (match.length !== 3) return;

  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      return;
  }
}

function handleError(err: unknown) {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
}

