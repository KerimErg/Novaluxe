"use client";

import { useState } from "react";
import { config, type Size } from "@/config";
import { formatPrice, shippingCostLabel } from "@/lib/format";

const { sizes, maxQuantity, priceCents, defaultSize } = config.product;

export function OrderForm() {
  const [size, setSize] = useState<Size>(defaultSize);
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Affichage uniquement : le montant facturé est recalculé par le serveur.
  const total = priceCents * quantity + config.shipping.costCents;

  function changeQuantity(value: number) {
    if (Number.isNaN(value)) return;
    setQuantity(Math.min(maxQuantity, Math.max(1, Math.round(value))));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size, quantity }),
      });
      const data: { url?: string; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error ?? "Une erreur est survenue. Merci de réessayer.");
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Merci de réessayer.");
      setPending(false);
    }
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <fieldset className="field">
        <legend>Taille</legend>
        <div className="sizes">
          {sizes.map((s) => (
            <label key={s} className="size">
              <input type="radio" name="size" value={s} checked={size === s} onChange={() => setSize(s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="quantity" className="field__label">
          Quantité
        </label>
        <div className="stepper">
          <button
            type="button"
            onClick={() => changeQuantity(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Retirer une veste"
          >
            −
          </button>
          <input
            id="quantity"
            name="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={maxQuantity}
            value={quantity}
            onChange={(e) => changeQuantity(e.target.valueAsNumber)}
          />
          <button
            type="button"
            onClick={() => changeQuantity(quantity + 1)}
            disabled={quantity >= maxQuantity}
            aria-label="Ajouter une veste"
          >
            +
          </button>
        </div>
      </div>

      <dl className="summary" aria-live="polite">
        <div>
          <dt>{config.product.name}, taille {size}</dt>
          <dd>
            {quantity} × {formatPrice(priceCents)}
          </dd>
        </div>
        <div>
          <dt>Livraison</dt>
          <dd>{shippingCostLabel()}</dd>
        </div>
        <div className="summary__total">
          <dt>Total TTC</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="button button--primary button--block" disabled={pending}>
        {pending ? "Redirection vers le paiement…" : "Payer ma commande"}
      </button>
      <p className="order-form__note">Paiement sécurisé par Stripe. France uniquement.</p>
    </form>
  );
}
