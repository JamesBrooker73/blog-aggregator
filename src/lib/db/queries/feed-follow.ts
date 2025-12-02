import { db } from "..";
import { users, feeds, feed_follow } from "../schema";
import { and, eq } from "drizzle-orm";

export async function createFeedFollow(userID: string, feedID: string) {
  const [newFeedFollow] = await db.insert(feed_follow)
                      .values({
                        user_id: userID,
                        feed_id: feedID
                      }).returning();

  const [result] = await db.select()
                      .from(feed_follow)
                      .innerJoin(users, eq(feed_follow.user_id, users.id))
                      .innerJoin(feeds, eq(feed_follow.feed_id, feeds.id))
                      .where(eq(feed_follow.id, newFeedFollow.id));

  return result;
}

export async function getFeedFollowsForUser(userID: string) {
  const userFeeds = await db.select()
                        .from(feed_follow)
                        .innerJoin(feeds, eq(feed_follow.feed_id, feeds.id))
                        .where(eq(feed_follow.user_id, userID));

  return userFeeds;
}

export async function unfollowFeed(userID: string, feedID: string) {
  await db.delete(feed_follow)
    .where(and(eq(feed_follow.feed_id, feedID), eq(feed_follow.user_id,userID)));
}