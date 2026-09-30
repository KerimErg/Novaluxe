import { config } from "@/config";

/** Libellés et ancre qui dépendent du mode de vente (liste d'attente ou paiement). */
export const sales = config.checkoutEnabled
  ? { anchor: "commander", cta: "Commander", heroCta: "Commander la veste", title: "Commander" }
  : { anchor: "reserver", cta: "Réserver ma veste", heroCta: "Réserver ma veste", title: "Réserver ma veste" };
