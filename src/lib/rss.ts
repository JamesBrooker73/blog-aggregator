import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed>{
  const res = await fetch(feedURL, {
    method: "GET",
    headers: { 
      "User-Agent": "gator",
      accept: "application/rss+xml",
    }
  });
  if (!res.ok) {
    throw new Error(`failed to fetch feed: ${res.status} ${res.statusText}`);
  }

  const parser = new XMLParser();
  const raw = parser.parse(await res.text());

  if (!raw.rss || !raw.rss.channel) {
    throw new Error("There's no channel object");
  }

  const RSSFeed: RSSFeed = raw.rss;

  if (!RSSFeed.channel.title || typeof RSSFeed.channel.title !== "string" ||
      !RSSFeed.channel.link || typeof RSSFeed.channel.link !== "string" ||
      !RSSFeed.channel.description || typeof RSSFeed.channel.description !== "string"){
        throw new Error("Missing parameters in channel");
  }

  let items: any[] = [];

  if (Array.isArray(RSSFeed.channel.item)) {
    items = RSSFeed.channel.item;
  } else if (RSSFeed.channel.item) {
    items = [RSSFeed.channel.item];
  }

  let validItems: RSSItem[] = [];
  for (let RSSItem of items) {
    if ((RSSItem.title) && typeof RSSItem.title === "string" && 
        (RSSItem.link) && typeof RSSItem.link === "string" &&
        (RSSItem.description) && typeof RSSItem.description === "string" &&
        (RSSItem.pubDate) && typeof RSSItem.pubDate === "string")
    {
      validItems.push(RSSItem)
    }
  }

  return {
    channel: {
      title: RSSFeed.channel.title,
      link: RSSFeed.channel.link,
      description: RSSFeed.channel.description,
      item: validItems
    }
  }

}