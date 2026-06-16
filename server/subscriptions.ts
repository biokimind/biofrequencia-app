import { eq } from "drizzle-orm";
import { subscriptions, users } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Get user's active subscription
 */
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(subscriptions.createdAt)
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Check if user has active premium subscription
 */
export async function isUserPremium(userId: number): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;

  // Check if subscription is active
  if (subscription.status !== "active" && subscription.status !== "trialing") {
    return false;
  }

  // Check if subscription hasn't been canceled
  if (subscription.canceledAt) {
    return false;
  }

  // Check if current period is still valid
  if (subscription.currentPeriodEnd && new Date() > subscription.currentPeriodEnd) {
    return false;
  }

  return true;
}

/**
 * Create or update subscription after successful payment
 */
export async function upsertSubscription(
  userId: number,
  stripeSubscriptionId: string,
  stripeCustomerId: string,
  stripePriceId: string,
  status: string,
  currentPeriodStart?: Date,
  currentPeriodEnd?: Date
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert subscription: database not available");
    return null;
  }

  try {
    const result = await db
      .insert(subscriptions)
      .values({
        userId,
        stripeSubscriptionId,
        stripeCustomerId,
        stripePriceId,
        status: status as any,
        currentPeriodStart,
        currentPeriodEnd,
      })
      .onDuplicateKeyUpdate({
        set: {
          status: status as any,
          currentPeriodStart,
          currentPeriodEnd,
          updatedAt: new Date(),
        },
      });

    return result;
  } catch (error) {
    console.error("[Database] Failed to upsert subscription:", error);
    throw error;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(stripeSubscriptionId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot cancel subscription: database not available");
    return null;
  }

  try {
    await db
      .update(subscriptions)
      .set({
        status: "canceled",
        canceledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
  } catch (error) {
    console.error("[Database] Failed to cancel subscription:", error);
    throw error;
  }
}
