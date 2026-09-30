"use client";

import { useEffect, useRef, useState } from "react";
import { config, type Size } from "@/config";
import { formatPrice } from "@/lib/format";

const { sizes, maxQuantity, priceCents, defaultSize } = config.product;

// Netlify Forms : les réponses sont envoyées au fichier statique public/__forms.html.
const FORM_ENDPOINT = "/__forms.html";

export function WaitlistForm() {
  const [size, setSize] = useState<Size>(defaultSize);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "pending" | "sent" | "error">("idle");
  const confirmationRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "sent") confirmationRef.current?.focus();
  }, [status]);

  function changeQuantity(value: number) {
    if (Number.isNaN(value)) return;
    setQuantity(Math.min(maxQuantity, Math.max(1, Math.round(value))));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("pending");
    const data = new FormData(event.currentTarget);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
    } catch (error) {
      console.error("[réservation] Envoi impossible :", error);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="order-form confirmation" role="status">
        <h3 ref={confirmationRef} tabIndex={-1}>
          C&apos;est noté, merci&nbsp;!
        </h3>
        <p>
          Votre demande pour <strong>
            {quantity} veste{quantity > 1 ? "s" : ""} en taille {size}
          </strong>{" "}
          est bien enregistrée. Nous vous recontacterons dès que la veste sera disponible.
        </p>
        <p className="order-form__note">Aucun paiement n&apos;a été demandé.</p>
      </div>
    );
  }

  return (
    <form
      className="order-form"
      name={config.waitlistFormName}
      method="POST"
      action={FORM_ENDPOINT}
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value={config.waitlistFormName} />
      <p className="visually-hidden" aria-hidden="true">
        <label>
          Ne pas remplir : <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="field-row">
        <div className="field">
          <label htmlFor="prenom" className="field__label">
            Prénom
          </label>
          <input id="prenom" name="prenom" className="input" type="text" autoComplete="given-name" required />
        </div>
        <div className="field">
          <label htmlFor="email" className="field__label">
            E-mail
          </label>
          <input id="email" name="email" className="input" type="email" autoComplete="email" required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="telephone" className="field__label">
          Téléphone <span className="field__optional">(facultatif)</span>
        </label>
        <input id="telephone" name="telephone" className="input" type="tel" autoComplete="tel" />
      </div>

      <fieldset className="field">
        <legend>Taille</legend>
        <div className="sizes">
          {sizes.map((s) => (
            <label key={s} className="size">
              <input type="radio" name="taille" value={s} checked={size === s} onChange={() => setSize(s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="quantite" className="field__label">
          Quantité souhaitée
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
            id="quantite"
            name="quantite"
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

      <p className="indicative-price">
        Prix indicatif : <strong>{formatPrice(priceCents)}</strong> la veste. Aucun paiement n&apos;est
        demandé aujourd&apos;hui.
      </p>

      <label className="checkbox">
        <input type="checkbox" name="consentement" value="oui" required />
        <span>
          J&apos;accepte d&apos;être recontacté au sujet de cette veste.{" "}
          <a href="/confidentialite">En savoir plus</a>
        </span>
      </label>

      {status === "error" && (
        <p className="form-error" role="alert">
          L&apos;envoi a échoué. Vérifiez votre connexion et réessayez.
        </p>
      )}

      <button type="submit" className="button button--primary button--block" disabled={status === "pending"}>
        {status === "pending" ? "Envoi en cours…" : "Je veux cette veste"}
      </button>
      <p className="order-form__note">Sans engagement. Vos données ne servent qu&apos;à vous recontacter.</p>
    </form>
  );
}
