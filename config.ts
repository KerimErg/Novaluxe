/**
 * Configuration de la boutique.
 * Modifiez les valeurs ci-dessous : elles sont utilisées partout sur le site
 * (affichage, calcul du prix côté serveur, e-mails de notification).
 */
export const config = {
  /** Nom de la boutique (en-tête, titres, e-mails). */
  shopName: "Canarinho Store",

  /** Produit vendu. */
  product: {
    name: "Veste Nike Brésil",
    shortName: "Veste Brésil",
    description:
      "Veste officielle de l'équipe du Brésil, produit Nike authentique. Légère, chaude et coupe-vent.",
    /** Prix unitaire TTC en centimes (11990 = 119,90 €). Seul le serveur l'utilise pour facturer. */
    priceCents: 11990,
    currency: "eur",
    sizes: ["S", "M", "L", "XL", "XXL"] as const,
    defaultSize: "M",
    maxQuantity: 10,
  },

  /** Livraison (France uniquement). */
  shipping: {
    /** Frais de livraison en centimes (0 = offerte). */
    costCents: 0,
    minDays: 3,
    maxDays: 5,
  },

  /** Adresse qui reçoit la notification de chaque nouvelle commande. */
  notificationEmail: "vous@exemple.fr", // [À COMPLÉTER]

  /** Adresse de contact affichée aux clients (pages légales, confirmation). */
  contactEmail: "[À COMPLÉTER : e-mail de contact]",

  /**
   * Photos du produit (dossier /public/images).
   * Remplacez les fichiers placeholders par vos photos (ex. veste-1.jpg)
   * et mettez à jour les chemins ci-dessous.
   */
  images: [
    { src: "/images/veste-1.svg", alt: "Veste Brésil vue de face" },
    { src: "/images/veste-2.svg", alt: "Veste Brésil vue de dos" },
    { src: "/images/veste-3.svg", alt: "Détail du col et de la fermeture" },
    { src: "/images/veste-4.svg", alt: "Veste Brésil portée" },
  ],
} as const;

export type Size = (typeof config.product.sizes)[number];
