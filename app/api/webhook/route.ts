import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { Resend } from "resend";
import { config } from "@/config";
import { formatPrice } from "@/lib/format";
import { getStripe } from "@/lib/stripe";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function orderLines(session: Stripe.Checkout.Session): [string, string][] {
  const shipping = session.collected_information?.shipping_details;
  const customer = session.customer_details;
  const address = shipping?.address ?? customer?.address;
  const addressText = address
    ? [address.line1, address.line2, `${address.postal_code ?? ""} ${address.city ?? ""}`.trim(), address.country]
        .filter(Boolean)
        .join(", ")
    : "—";

  return [
    ["Nom", shipping?.name ?? customer?.name ?? "—"],
    ["Adresse", addressText],
    ["Téléphone", customer?.phone ?? "—"],
    ["E-mail", customer?.email ?? "—"],
    ["Taille", session.metadata?.size ?? "—"],
    ["Quantité", session.metadata?.quantity ?? "—"],
    ["Montant payé", formatPrice(session.amount_total ?? 0)],
    ["Référence Stripe", session.id],
  ];
}

async function notifyNewOrder(session: Stripe.Checkout.Session) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[webhook] RESEND_API_KEY absente : notification non envoyée.", session.id);
    return;
  }

  const lines = orderLines(session);
  const text = lines.map(([k, v]) => `${k} : ${v}`).join("\n");
  const html = `<h2>Nouvelle commande ${escapeHtml(config.shopName)}</h2><table cellpadding="6">${lines
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table>`;

  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.RESEND_FROM ?? `${config.shopName} <onboarding@resend.dev>`,
    to: config.notificationEmail,
    subject: `Nouvelle commande — ${session.metadata?.size ?? "?"} × ${session.metadata?.quantity ?? "?"} — ${formatPrice(session.amount_total ?? 0)}`,
    text: `Nouvelle commande ${config.shopName}\n\n${text}`,
    html,
  });
  if (error) throw new Error(`Resend : ${error.message}`);
}

export async function POST(request: Request) {
  // Paiement désactivé (mode liste d'attente) : voir config.checkoutEnabled.
  if (!config.checkoutEnabled) {
    return NextResponse.json({ error: "Paiement en ligne désactivé." }, { status: 404 });
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error("[webhook] Signature invalide :", error);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      try {
        await notifyNewOrder(session);
      } catch (error) {
        // Réponse 500 : Stripe renverra l'événement plus tard.
        console.error("[webhook] Envoi de la notification impossible :", error);
        return NextResponse.json({ error: "Notification non envoyée" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
