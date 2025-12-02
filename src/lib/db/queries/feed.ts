import { db } from "..";
import { users, feeds } from "../schema";
import { eq, sql } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function getUserFeed(userID: string) {
  const [result] = await db
                      .select({
                        url: feeds.url,
                      })
                      .from(feeds)
                      .where(
                        eq(feeds.user_id, userID)
                      )
  return result;
}

export async function addUserFeed(userID: string, feedName: string, url: string) {
  const result = await db.insert(feeds)
          .values({ 
            name: feedName,
            url: url,
            user_id: userID
          }).returning();

  return firstOrUndefined(result);
}

export async function getAllFeeds() { 
  const result = await db.
                    select({
                      feedName: feeds.name,
                      feedUrl: feeds.url,
                      username: users.name
                    })
                    .from(feeds)
                    .innerJoin(users, eq(feeds.user_id, users.id));

  return result;

}

export async function getFeedID(feedUrl: string) {
  const feed = await db.select().from(feeds).where(eq(feeds.url, feedUrl));
  
  return firstOrUndefined(feed);
}

export async function markFeedFecthed(feedID: string) {
  await db.update(feeds)
          .set({
            last_fetched_at: sql`NOW()`,
          })
          .where(eq(feeds.id, feedID));
 }

export async function getNextFeedToFetch() {
  const result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.last_fetched_at} desc nulls first`)
    .limit(1);;
  return firstOrUndefined(result);
    
}



