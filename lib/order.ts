import { config, type Size } from "@/config";

export type Order = { size: Size; quantity: number };

export function isSize(value: unknown): value is Size {
  return typeof value === "string" && (config.product.sizes as readonly string[]).includes(value);
}

/** Valide la commande reçue du navigateur. Seules la taille et la quantité sont acceptées. */
export function parseOrder(input: unknown): Order | null {
  if (typeof input !== "object" || input === null) return null;
  const { size, quantity } = input as Record<string, unknown>;
  const qty = typeof quantity === "string" ? Number(quantity) : quantity;
  if (!isSize(size)) return null;
  if (typeof qty !== "number" || !Number.isInteger(qty)) return null;
  if (qty < 1 || qty > config.product.maxQuantity) return null;
  return { size, quantity: qty };
}

/** Total en centimes, calculé à partir de config.ts. */
export function orderTotalCents(quantity: number): number {
  return config.product.priceCents * quantity + config.shipping.costCents;
}
