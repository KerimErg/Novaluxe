import type { Metadata } from "next";
import { config } from "@/config";
import { LegalPage, Todo } from "@/components/Legal";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function Privacy() {
  const checkout = config.checkoutEnabled;

  return (
    <LegalPage title="Politique de confidentialité">
      <h2>Responsable du traitement</h2>
      <p>
        <Todo>nom ou raison sociale et adresse</Todo>, joignable à {config.contactEmail}, est
        responsable du traitement des données personnelles collectées sur ce site.
      </p>

      <h2>Données collectées</h2>
      <p>
        Lorsque vous remplissez le formulaire « Je veux cette veste », nous collectons :
      </p>
      <ul>
        <li>votre prénom et votre adresse e-mail (obligatoires) ;</li>
        <li>votre numéro de téléphone, uniquement si vous choisissez de l&apos;indiquer ;</li>
        <li>la taille et la quantité souhaitées ;</li>
        <li>votre accord pour être recontacté, ainsi que la date et l&apos;heure de l&apos;envoi.</li>
      </ul>
      {checkout && (
        <>
          <p>Lors d&apos;une commande, les données suivantes sont collectées via Stripe Checkout :</p>
          <ul>
            <li>nom, prénom, adresse de livraison et de facturation ;</li>
            <li>adresse e-mail et numéro de téléphone ;</li>
            <li>détails de la commande (taille, quantité, montant) ;</li>
            <li>données de paiement, traitées exclusivement par Stripe (nous n&apos;y avons pas accès).</li>
          </ul>
        </>
      )}
      <p>
        Aucun paiement n&apos;est demandé via le formulaire de réservation. Le site n&apos;utilise pas
        de cookies publicitaires ni d&apos;outil de mesure d&apos;audience.
      </p>

      <h2>Finalité et base légale</h2>
      <ul>
        <li>
          Vous recontacter au sujet de cette veste (disponibilité, confirmation de la taille et de la
          quantité, modalités d&apos;achat) : <strong>votre consentement</strong>, donné en cochant la
          case prévue dans le formulaire.
        </li>
        {checkout && (
          <>
            <li>Traitement et livraison des commandes, service client : exécution du contrat.</li>
            <li>Facturation et comptabilité : obligation légale.</li>
            <li>Prévention de la fraude au paiement : intérêt légitime.</li>
          </>
        )}
      </ul>
      <p>
        Vos données ne sont jamais vendues ni utilisées pour d&apos;autres produits, et vous ne serez
        pas inscrit à une newsletter sans votre accord.
      </p>

      <h2>Destinataires</h2>
      <p>
        Les données sont destinées uniquement à {config.shopName}. Elles sont hébergées par nos
        prestataires techniques :
      </p>
      <ul>
        <li>Netlify (hébergement du site et réception des formulaires) ;</li>
        {checkout && (
          <>
            <li>Stripe (paiement et reçus) ;</li>
            <li>Resend (envoi de l&apos;e-mail interne de notification de commande) ;</li>
            <li>le transporteur chargé de la livraison : <Todo>nom du transporteur</Todo>.</li>
          </>
        )}
      </ul>
      <p>
        Ces prestataires peuvent être situés aux États-Unis ; les transferts sont encadrés par les
        clauses contractuelles types de la Commission européenne et/ou le Data Privacy Framework.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Les données du formulaire de réservation sont conservées jusqu&apos;à la mise en vente de la
        veste et au plus <Todo>12 mois</Todo> après votre demande, puis supprimées. Elles sont
        supprimées immédiatement si vous retirez votre consentement.
        {checkout && (
          <>
            {" "}
            Les données de commande sont conservées pendant la durée de la relation commerciale,
            puis archivées 10 ans pour les pièces comptables (article L123-22 du Code de commerce).
          </>
        )}
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez à tout moment retirer votre consentement et demander la suppression de vos
        données, sans avoir à vous justifier : il suffit d&apos;écrire à {config.contactEmail} ou de
        répondre à l&apos;un de nos messages. Vous disposez aussi d&apos;un droit d&apos;accès, de
        rectification, de limitation, d&apos;opposition et de portabilité de vos données.
      </p>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
        auprès de la CNIL (www.cnil.fr).
      </p>
    </LegalPage>
  );
}
