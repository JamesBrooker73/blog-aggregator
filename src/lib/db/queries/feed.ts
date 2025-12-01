import { url } from "inspector";
import { db } from "..";
import { users, feeds } from "../schema";
import { eq } from "drizzle-orm";

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
  const [result] = await db.insert(feeds)
          .values({ 
            name: feedName,
            url: url,
            user_id: userID
          }).returning();

  return result;
}

export async function getAllFeeds() { 
  const result = await db.
                    select({
                      feedName: feeds.name,
                      feedUrl: feeds.url,
                      username: users.name
                    })
                    .from(feeds)
                    .innerJoin(users, eq(feeds.user_id, users.id))

  return result;


}