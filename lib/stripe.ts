import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

/** Client Stripe créé à la demande (la clé n'est pas requise au moment du build). */
export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY manquante : voir .env.example");
    client = new Stripe(key);
  }
  return client;
}
