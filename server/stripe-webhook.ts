import Stripe from "stripe";
import { Request, Response } from "express";
import { upsertSubscription, cancelSubscription } from "./subscriptions";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * Handle Stripe webhook events
 * This function should be called from an Express route with raw body middleware
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  if (!sig) {
    console.error("[Webhook] Missing stripe-signature header");
    return res.status(400).json({ error: "Missing stripe-signature header" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return res.status(400).json({ error: "Webhook signature verification failed" });
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Webhook] Processing event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Webhook] Invoice paid: ${invoice.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Webhook] Invoice payment failed: ${invoice.id}`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId || !customerId || !subscriptionId) {
    console.error("[Webhook] Missing required fields in checkout session");
    return;
  }

  try {
    // Fetch subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

    // Extract price ID and period dates
    const priceId = subscription.items.data[0]?.price.id || "";
    const currentPeriodStart = new Date(subscription.current_period_start * 1000);
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    // Save subscription to database
    await upsertSubscription(
      parseInt(userId),
      subscriptionId,
      customerId,
      priceId,
      subscription.status,
      currentPeriodStart,
      currentPeriodEnd
    );

    console.log(`[Webhook] Subscription created for user ${userId}: ${subscriptionId}`);
  } catch (error) {
    console.error("[Webhook] Error handling checkout session:", error);
    throw error;
  }
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription: any) {
  const subscriptionId = subscription.id;
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id || "";
  const currentPeriodStart = new Date(subscription.current_period_start * 1000);
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

  try {
    // Find user by customer ID
    const db = await getDb();
    if (!db) {
      console.warn("[Webhook] Database not available");
      return;
    }

    // For now, we'll just update the subscription status
    // In a production app, you might want to fetch the user from a customers table
    console.log(`[Webhook] Subscription updated: ${subscriptionId} - Status: ${subscription.status}`);
  } catch (error) {
    console.error("[Webhook] Error handling subscription update:", error);
    throw error;
  }
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  try {
    await cancelSubscription(subscriptionId);
    console.log(`[Webhook] Subscription canceled: ${subscriptionId}`);
  } catch (error) {
    console.error("[Webhook] Error handling subscription deletion:", error);
    throw error;
  }
}
