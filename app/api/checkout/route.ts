import { NextResponse } from "next/server";
import { config } from "@/config";
import { parseOrder } from "@/lib/order";
import { getStripe } from "@/lib/stripe";

function siteUrl(request: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? new URL(request.url).origin;
}

export async function POST(request: Request) {
  // Paiement désactivé (mode liste d'attente) : voir config.checkoutEnabled.
  if (!config.checkoutEnabled) {
    return NextResponse.json({ error: "Paiement en ligne désactivé." }, { status: 404 });
  }
  const body = await request.json().catch(() => null);
  const order = parseOrder(body);
  if (!order) {
    return NextResponse.json({ error: "Taille ou quantité invalide." }, { status: 400 });
  }

  const { product, shipping } = config;
  const origin = siteUrl(request);

  try {
    // Le prix vient uniquement de config.ts : le navigateur n'envoie que taille et quantité.
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      locale: "fr",
      line_items: [
        {
          quantity: order.quantity,
          price_data: {
            currency: product.currency,
            unit_amount: product.priceCents,
            product_data: {
              name: `${product.name} — Taille ${order.size}`,
              description: product.description,
            },
          },
        },
      ],
      shipping_address_collection: { allowed_countries: ["FR"] },
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: shipping.costCents === 0 ? "Livraison offerte" : "Livraison",
            type: "fixed_amount",
            fixed_amount: { amount: shipping.costCents, currency: product.currency },
            delivery_estimate: {
              minimum: { unit: "business_day", value: shipping.minDays },
              maximum: { unit: "business_day", value: shipping.maxDays },
            },
          },
        },
      ],
      metadata: { size: order.size, quantity: String(order.quantity) },
      payment_intent_data: {
        description: `${config.shopName} — ${product.name} ${order.size} × ${order.quantity}`,
        metadata: { size: order.size, quantity: String(order.quantity) },
      },
      success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/annule`,
    });

    if (!session.url) throw new Error("Session Stripe sans URL");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout] Création de la session Stripe impossible :", error);
    return NextResponse.json(
      { error: "Le paiement est momentanément indisponible. Merci de réessayer." },
      { status: 500 },
    );
  }
}
