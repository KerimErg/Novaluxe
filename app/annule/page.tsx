import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { config } from "@/config";

export const metadata: Metadata = {
  title: "Paiement annulé",
  robots: { index: false },
};

export default function Cancelled() {
  if (!config.checkoutEnabled) notFound();
  return (
    <section className="page container">
      <div className="page__card">
        <p className="eyebrow">Paiement annulé</p>
        <h1>Pas de souci</h1>
        <p className="page__lead">
          Votre paiement n&apos;a pas été finalisé et vous n&apos;avez pas été débité. Votre veste
          vous attend : vous pouvez reprendre votre commande quand vous le souhaitez.
        </p>
        <div className="actions">
          <Link href="/#commander" className="button button--primary">
            Réessayer ma commande
          </Link>
          <Link href="/" className="text-link">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </section>
  );
}
