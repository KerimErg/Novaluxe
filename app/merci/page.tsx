import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type Stripe from "stripe";
import { config } from "@/config";
import { deliveryLabel, formatPrice } from "@/lib/format";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Merci pour votre commande",
  robots: { index: false },
};

async function getSession(id: string | undefined): Promise<Stripe.Checkout.Session | null> {
  if (!id || !id.startsWith("cs_")) return null;
  try {
    const session = await getStripe().checkout.sessions.retrieve(id);
    return session.status === "complete" ? session : null;
  } catch (error) {
    console.error("[merci] Session introuvable :", error);
    return null;
  }
}

export default async function ThankYou({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  if (!config.checkoutEnabled) notFound();
  const { session_id } = await searchParams;
  const session = await getSession(session_id);

  if (!session) {
    return (
      <section className="page container">
        <div className="page__card">
          <h1>Commande introuvable</h1>
          <p className="page__lead">
            Nous n&apos;avons pas pu retrouver cette commande. Si vous avez été débité, vous recevrez
            un reçu par e-mail. Pour toute question : {config.contactEmail}.
          </p>
          <Link href="/" className="button button--primary">
            Retour à la boutique
          </Link>
        </div>
      </section>
    );
  }

  const shipping = session.collected_information?.shipping_details;
  const address = shipping?.address;
  const firstName = (shipping?.name ?? session.customer_details?.name ?? "").split(" ")[0];

  return (
    <section className="page container">
      <div className="page__card">
        <p className="eyebrow">Paiement confirmé</p>
        <h1>Merci{firstName ? ` ${firstName}` : ""} !</h1>
        <p className="page__lead">
          Votre commande est enregistrée. Un reçu a été envoyé à{" "}
          <strong>{session.customer_details?.email ?? "votre adresse e-mail"}</strong>. Livraison
          prévue sous {deliveryLabel()}.
        </p>

        <dl className="recap">
          <div>
            <dt>Article</dt>
            <dd>{config.product.name}</dd>
          </div>
          <div>
            <dt>Taille</dt>
            <dd>{session.metadata?.size}</dd>
          </div>
          <div>
            <dt>Quantité</dt>
            <dd>{session.metadata?.quantity}</dd>
          </div>
          {address && (
            <div>
              <dt>Livraison à</dt>
              <dd>
                {shipping?.name}
                <br />
                {address.line1}
                {address.line2 && <>, {address.line2}</>}
                <br />
                {address.postal_code} {address.city}
              </dd>
            </div>
          )}
          <div>
            <dt>Total payé</dt>
            <dd>{formatPrice(session.amount_total ?? 0)}</dd>
          </div>
        </dl>

        <Link href="/" className="button button--dark">
          Retour à la boutique
        </Link>
      </div>
    </section>
  );
}
