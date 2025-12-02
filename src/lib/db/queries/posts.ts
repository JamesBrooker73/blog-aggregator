import { db } from "..";
import { feed_follow, feeds, NewPost, posts, users } from "../schema";
import { eq, desc } from "drizzle-orm";

export async function createPost(post: NewPost) {
  const [result] = await db.insert(posts).values(post).onConflictDoNothing({ target: posts.url }).returning();
  return result;
}

export async function getPostsForUser(userID: string, limit: number) {
  const result = await db
    .select({
      id: posts.id,
      created_at: posts.createdAt,
      updated_at: posts.updatedAt,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      published_at: posts.published_at,
      feed_id: posts.feed_id,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feed_follow, eq(posts.feed_id, feed_follow.feed_id))
    .innerJoin(feeds, eq(posts.feed_id, feeds.id))
    .where(eq(feed_follow.user_id, userID))
    .orderBy(desc(posts.published_at))
    .limit(limit);
  return result;
}