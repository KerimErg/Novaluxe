import { config } from "@/config";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: config.product.currency.toUpperCase(),
});

/** Formate un montant en centimes : 11990 → « 119,90 € ». */
export function formatPrice(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

export function deliveryLabel(): string {
  const { minDays, maxDays } = config.shipping;
  return `${minDays} à ${maxDays} jours ouvrés`;
}

export function shippingCostLabel(): string {
  return config.shipping.costCents === 0 ? "Offerte" : formatPrice(config.shipping.costCents);
}
