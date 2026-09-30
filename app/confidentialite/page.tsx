import type { Metadata } from "next";
import { config } from "@/config";
import { LegalPage, Todo } from "@/components/Legal";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function Privacy() {
  return (
    <LegalPage title="Politique de confidentialité">
      <h2>Responsable du traitement</h2>
      <p>
        <Todo>nom ou raison sociale et adresse</Todo>, joignable à {config.contactEmail}, est
        responsable du traitement des données personnelles collectées sur ce site.
      </p>

      <h2>Données collectées</h2>
      <p>Lors d&apos;une commande, les données suivantes sont collectées via Stripe Checkout :</p>
      <ul>
        <li>nom, prénom, adresse de livraison et de facturation ;</li>
        <li>adresse e-mail et numéro de téléphone ;</li>
        <li>détails de la commande (taille, quantité, montant) ;</li>
        <li>données de paiement, traitées exclusivement par Stripe (nous n&apos;y avons pas accès).</li>
      </ul>
      <p>Le site n&apos;utilise pas de cookies publicitaires ni d&apos;outil de mesure d&apos;audience.</p>

      <h2>Finalités et bases légales</h2>
      <ul>
        <li>Traitement et livraison de la commande, service client : exécution du contrat.</li>
        <li>Facturation et comptabilité : obligation légale.</li>
        <li>Prévention de la fraude au paiement : intérêt légitime.</li>
      </ul>

      <h2>Destinataires</h2>
      <ul>
        <li>Stripe (paiement et reçus) ;</li>
        <li>Resend (envoi de l&apos;e-mail interne de notification de commande) ;</li>
        <li>Vercel (hébergement du site) ;</li>
        <li>le transporteur chargé de la livraison : <Todo>nom du transporteur</Todo>.</li>
      </ul>
      <p>
        Certains de ces prestataires sont situés aux États-Unis ; les transferts sont encadrés par
        les clauses contractuelles types de la Commission européenne et/ou le Data Privacy Framework.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Les données de commande sont conservées pendant la durée nécessaire à la gestion de la
        relation commerciale, puis archivées 10 ans pour les pièces comptables (article L123-22 du
        Code de commerce). <Todo>à ajuster si besoin</Todo>
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation,
        d&apos;opposition et de portabilité de vos données. Pour les exercer, écrivez à{" "}
        {config.contactEmail}. Vous pouvez également introduire une réclamation auprès de la CNIL
        (www.cnil.fr).
      </p>
    </LegalPage>
  );
}
