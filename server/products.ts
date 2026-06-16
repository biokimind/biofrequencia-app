/**
 * Stripe Products Configuration
 * 
 * This file defines the products and prices for the Biofrequência app.
 * You need to create these products in your Stripe dashboard and update the IDs below.
 * 
 * To create products in Stripe:
 * 1. Go to https://dashboard.stripe.com/products
 * 2. Create a new product called "Biofrequência Premium"
 * 3. Add a price (monthly recurring, R$9.90 BRL)
 * 4. Copy the Price ID and update PREMIUM_MONTHLY_PRICE_ID below
 */

export const STRIPE_PRODUCTS = {
  PREMIUM_MONTHLY: {
    name: "Biofrequência Premium - Mensal",
    description: "Acesso ilimitado a todas as frequências Solfeggio e Rife, sessões de até 5 minutos, exportação de áudio.",
    priceId: process.env.VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID || "price_placeholder", // TODO: Update with actual price ID
    amount: 990, // R$9.90 in cents
    currency: "brl",
    interval: "month",
  },
};

/**
 * Helper function to get product by ID
 */
export function getProductByPriceId(priceId: string) {
  for (const product of Object.values(STRIPE_PRODUCTS)) {
    if (product.priceId === priceId) {
      return product;
    }
  }
  return null;
}
