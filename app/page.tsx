import Image from "next/image";
import { config } from "@/config";
import { deliveryLabel, formatPrice, shippingCostLabel } from "@/lib/format";
import { OrderForm } from "@/components/OrderForm";
import { WaitlistForm } from "@/components/WaitlistForm";
import { sales } from "@/lib/sales";

const features = [
  {
    title: "Authentique",
    text: "Produit officiel Nike, neuf, vérifié avant chaque envoi.",
    icon: <path d="M5 12.5 10 17.5 19.5 7" />,
  },
  {
    title: "Légère et chaude",
    text: "Tissu technique coupe-vent qui garde la chaleur sans alourdir.",
    icon: <path d="M20 4C9 4 4 10 4 20c3-5 7-8 12-9-4 2-7 5-8 9 8 0 12-6 12-16Z" />,
  },
  {
    title: config.shipping.costCents === 0 ? "Livraison offerte" : "Livraison rapide",
    text: `Expédiée partout en France, reçue en ${deliveryLabel()}.`,
    icon: (
      <>
        <path d="M2 6h11v10H2zM13 10h4l3 3v3h-7z" />
        <circle cx="6" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </>
    ),
  },
];

export default function Home() {
  const [cover, ...gallery] = config.images;

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="eyebrow">Produit Nike authentique · {config.shopName}</p>
            <h1 id="hero-title" className="hero__title">
              Veste <span>Brésil</span>
            </h1>
            <p className="hero__lead">
              La veste de la Seleção, légère et chaude, pour afficher le jaune et vert en toute saison.
            </p>
            <p className="hero__price">
              {formatPrice(config.product.priceCents)}
              <small>
                {config.checkoutEnabled
                  ? `TTC · livraison ${shippingCostLabel().toLowerCase()}`
                  : "Prix indicatif · sans paiement aujourd'hui"}
              </small>
            </p>
            <a href={`#${sales.anchor}`} className="button button--dark">
              {sales.heroCta}
            </a>
          </div>
          <div className="hero__visual">
            <Image src={cover.src} alt={cover.alt} width={800} height={1000} priority />
          </div>
        </div>
        <div className="stripe" aria-hidden="true" />
      </section>

      <section className="features" aria-label="Pourquoi cette veste">
        <ul className="container features__list">
          {features.map((f) => (
            <li key={f.title} className="feature">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="feature__icon">
                {f.icon}
              </svg>
              <h2>{f.title}</h2>
              <p>{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="gallery" aria-labelledby="gallery-title">
        <div className="container">
          <h2 id="gallery-title" className="section-title">En détail</h2>
          <ul className="gallery__list">
            {[cover, ...gallery].map((img) => (
              <li key={img.src}>
                <Image src={img.src} alt={img.alt} width={800} height={1000} sizes="(min-width: 900px) 25vw, 70vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id={sales.anchor} className="order" aria-labelledby="order-title">
        <div className="container order__inner">
          <div className="order__intro">
            <h2 id="order-title" className="section-title">{sales.title}</h2>
            {config.checkoutEnabled ? (
              <>
                <p>
                  Choisissez votre taille et la quantité. Le paiement est sécurisé par Stripe : vous
                  saisirez votre adresse de livraison et votre carte à l&apos;étape suivante.
                </p>
                <ul className="order__facts">
                  <li>Livraison en France métropolitaine : {deliveryLabel()}</li>
                  <li>Retour possible sous 14 jours</li>
                  <li>Reçu envoyé par e-mail</li>
                </ul>
              </>
            ) : (
              <>
                <p>
                  La veste arrive bientôt. Laissez vos coordonnées, votre taille et la quantité
                  souhaitée : nous vous recontactons en priorité dès qu&apos;elle est disponible.
                </p>
                <ul className="order__facts">
                  <li>Aucun paiement maintenant, sans engagement</li>
                  <li>Prix indicatif : {formatPrice(config.product.priceCents)} la veste</li>
                  <li>Livraison en France métropolitaine : {deliveryLabel()}</li>
                </ul>
              </>
            )}
          </div>
          {config.checkoutEnabled ? <OrderForm /> : <WaitlistForm />}
        </div>
      </section>
    </>
  );
}
