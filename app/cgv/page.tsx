import type { Metadata } from "next";
import { config } from "@/config";
import { LegalPage, Todo } from "@/components/Legal";
import { deliveryLabel, formatPrice, shippingCostLabel } from "@/lib/format";

export const metadata: Metadata = { title: "Conditions générales de vente" };

export default function Terms() {
  return (
    <LegalPage title="Conditions générales de vente">
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales de vente (CGV) régissent les ventes réalisées sur le site{" "}
        {config.shopName}, édité par <Todo>nom ou raison sociale, adresse, SIRET</Todo>, auprès de
        consommateurs résidant en France. Toute commande implique l&apos;acceptation des CGV.
      </p>

      <h2>2. Produit</h2>
      <p>
        Le produit proposé est une {config.product.name}, article Nike authentique{" "}
        <Todo>neuf avec étiquette / état</Todo>, revendu par un revendeur indépendant sans lien avec
        Nike, Inc. Les photos sont aussi fidèles que possible mais n&apos;ont pas de valeur
        contractuelle.
      </p>

      <h2>3. Prix</h2>
      <p>
        Le prix est de {formatPrice(config.product.priceCents)} TTC par article (
        <Todo>TVA incluse, ou « TVA non applicable, art. 293 B du CGI »</Todo>). Les frais de
        livraison en France sont : {shippingCostLabel().toLowerCase()}. Le prix applicable est celui
        affiché au moment de la commande.
      </p>

      <h2>4. Commande et paiement</h2>
      <p>
        Le client choisit la taille et la quantité, puis est redirigé vers la page de paiement
        sécurisée Stripe où il saisit ses coordonnées et paie par carte bancaire. La commande est
        ferme dès la confirmation du paiement ; un reçu est envoyé par e-mail.
      </p>

      <h2>5. Livraison</h2>
      <p>
        Les commandes sont livrées en France uniquement <Todo>métropolitaine / DOM inclus</Todo>, à
        l&apos;adresse indiquée lors du paiement, sous {deliveryLabel()} à compter de la
        confirmation, par <Todo>transporteur</Todo>. En cas de retard supérieur à 30 jours, le client
        peut annuler sa commande et être remboursé dans les conditions des articles L216-2 et
        suivants du Code de la consommation.
      </p>

      <h2>6. Droit de rétractation</h2>
      <p>
        Conformément à l&apos;article L221-18 du Code de la consommation, le client dispose d&apos;un
        délai de <strong>14 jours</strong> à compter de la réception du produit pour exercer son
        droit de rétractation, sans avoir à se justifier ni à payer de pénalité.
      </p>
      <p>
        Pour l&apos;exercer, le client informe {config.shopName} de sa décision par une déclaration
        dénuée d&apos;ambiguïté (par exemple par e-mail à {config.contactEmail}) ou au moyen du
        formulaire ci-dessous. Il renvoie ensuite le produit, non porté et dans son état d&apos;origine,
        dans les 14 jours suivant sa décision, à l&apos;adresse : <Todo>adresse de retour</Todo>. Les
        frais de retour sont à la charge <Todo>du client / du vendeur</Todo>.
      </p>
      <p>
        {config.shopName} rembourse la totalité des sommes versées, y compris les frais de livraison
        initiaux, au plus tard 14 jours après avoir été informé de la rétractation, par le même moyen
        de paiement. Le remboursement peut être différé jusqu&apos;à réception du produit ou de la
        preuve de son expédition.
      </p>
      <p>
        <strong>Formulaire de rétractation</strong> (à compléter et renvoyer uniquement si vous
        souhaitez vous rétracter) : « À l&apos;attention de <Todo>nom, adresse, e-mail</Todo> : je
        vous notifie par la présente ma rétractation du contrat portant sur la vente du bien
        ci-dessous : <em>{config.product.name}, taille …, quantité …</em> — commandé le … / reçu le …
        — Nom du consommateur — Adresse du consommateur — Signature (en cas de formulaire papier) —
        Date. »
      </p>

      <h2>7. Garanties légales</h2>
      <p>
        Le produit bénéficie de la garantie légale de conformité (articles L217-3 et suivants du Code
        de la consommation), pendant 2 ans à compter de la délivrance, et de la garantie des vices
        cachés (articles 1641 et suivants du Code civil). Pour toute réclamation :{" "}
        {config.contactEmail}.
      </p>

      <h2>8. Données personnelles</h2>
      <p>
        Les données collectées sont traitées conformément à notre{" "}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>9. Médiation et litiges</h2>
      <p>
        En cas de litige, le client peut recourir gratuitement au médiateur de la consommation :{" "}
        <Todo>nom, site web et adresse du médiateur</Todo>. Il peut aussi utiliser la plateforme
        européenne de règlement en ligne des litiges. Les présentes CGV sont soumises au droit
        français.
      </p>
    </LegalPage>
  );
}
