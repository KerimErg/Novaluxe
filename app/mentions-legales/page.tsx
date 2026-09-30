import type { Metadata } from "next";
import { config } from "@/config";
import { LegalPage, Todo } from "@/components/Legal";

export const metadata: Metadata = { title: "Mentions légales" };

export default function LegalNotice() {
  return (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Le site {config.shopName} est édité par <Todo>nom et prénom ou raison sociale</Todo>,{" "}
        <Todo>statut : entrepreneur individuel / micro-entreprise / société (forme et capital)</Todo>.
      </p>
      <ul>
        <li>Adresse : <Todo>adresse postale</Todo></li>
        <li>SIRET : <Todo>numéro SIRET</Todo></li>
        <li>RCS ou RNE : <Todo>ville d&apos;immatriculation et numéro</Todo></li>
        <li>N° de TVA intracommunautaire : <Todo>numéro, ou « TVA non applicable, art. 293 B du CGI »</Todo></li>
        <li>E-mail : {config.contactEmail}</li>
        <li>Téléphone : <Todo>numéro de téléphone</Todo></li>
        <li>Directeur de la publication : <Todo>nom et prénom</Todo></li>
      </ul>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Netlify, Inc., <Todo>adresse postale, indiquée sur netlify.com</Todo>,
        États-Unis — netlify.com.
      </p>

      {config.checkoutEnabled && (
        <>
          <h2>Paiement</h2>
          <p>
            Les paiements sont traités par Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower,
            Grand Canal Dock, Dublin, D02 H210, Irlande. Aucune donnée bancaire n&apos;est conservée
            par {config.shopName}.
          </p>
        </>
      )}

      <h2>Propriété intellectuelle</h2>
      <p>
        {config.shopName} est un revendeur indépendant, sans lien avec Nike, Inc. ni avec la
        Confédération brésilienne de football. Nike est une marque de Nike, Inc. Les marques citées
        appartiennent à leurs propriétaires respectifs et ne sont mentionnées que pour décrire le
        produit revendu. Les textes et photos du site sont la propriété de <Todo>éditeur</Todo> sauf
        mention contraire.
      </p>

      <h2>Contact</h2>
      <p>Pour toute question, écrivez à {config.contactEmail}.</p>
    </LegalPage>
  );
}
