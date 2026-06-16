import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { isUserPremium } from "./subscriptions";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Subscription and Premium features
  subscription: router({
    isPremium: protectedProcedure.query(async ({ ctx }) => {
      const isPremium = await isUserPremium(ctx.user.id);
      return { isPremium };
    }),

    createCheckoutSession: protectedProcedure
      .input(z.object({
        priceId: z.string(),
        origin: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

        try {
          const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            customer_email: ctx.user.email || undefined,
            client_reference_id: ctx.user.id.toString(),
            line_items: [
              {
                price: input.priceId,
                quantity: 1,
              },
            ],
            success_url: `${input.origin}/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${input.origin}/`,
            allow_promotion_codes: true,
            metadata: {
              user_id: ctx.user.id.toString(),
              customer_email: ctx.user.email || "",
              customer_name: ctx.user.name || "",
            },
          });

          return {
            checkoutUrl: session.url,
            sessionId: session.id,
          };
        } catch (error) {
          console.error("[Stripe] Error creating checkout session:", error);
          throw error;
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
