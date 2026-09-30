# Canarinho Store — Veste Brésil

Site e-commerce d'un seul produit (veste Nike Brésil) : Next.js + Stripe Checkout + Resend.
Pas de base de données : **Stripe est votre registre de commandes** (tableau de bord Stripe → Paiements).

- Page d'accueil : présentation, galerie, choix de la taille et de la quantité, paiement.
- `/merci` : confirmation après paiement (récapitulatif lu depuis Stripe).
- `/annule` : retour si le client abandonne le paiement.
- `/api/checkout` : crée la session de paiement Stripe. **Le prix est calculé ici, côté serveur.**
- `/api/webhook` : reçu de Stripe après chaque paiement → vous envoie un e-mail « nouvelle commande ».
- `/mentions-legales`, `/cgv`, `/confidentialite` : textes modèles à compléter.

---

## 0. Ce qu'il faut modifier avant de vendre

1. **`config.ts`** (à la racine) : nom de la boutique, prix (en centimes : `11990` = 119,90 €),
   délais et frais de livraison, **e-mail qui reçoit les notifications** (`notificationEmail`),
   e-mail de contact, liste des photos.
2. **Photos** : déposez vos photos dans `public/images/` (par ex. `veste-1.jpg` … `veste-4.jpg`,
   format portrait 4:5 conseillé, ~1600 × 2000 px), puis mettez à jour les chemins dans `config.ts`
   (`images`). Supprimez ensuite les fichiers `veste-*.svg` (placeholders).
3. **Pages légales** : cherchez `[À COMPLÉTER` dans le dossier `app/` (ils sont surlignés en jaune
   sur le site) et remplacez chaque `<Todo>…</Todo>` par votre texte. Faites-les relire si vous
   avez un doute.

---

## 1. Installer le projet sur votre ordinateur

Prérequis : [Node.js](https://nodejs.org) version 20 ou plus (prenez la version « LTS »).

```bash
npm install
cp .env.example .env.local
```

Le fichier `.env.local` contient vos clés secrètes. **Ne le partagez jamais et ne le publiez pas sur
GitHub** (il est déjà ignoré par git).

---

## 2. Créer un compte Stripe et récupérer les clés

1. Créez un compte sur <https://dashboard.stripe.com/register>.
2. Vous êtes automatiquement en **mode test** (bandeau « Environnement de test » / « Test mode »).
   En mode test, aucun argent réel ne circule.
3. Allez dans **Développeurs → Clés API** (<https://dashboard.stripe.com/test/apikeys>).
4. Copiez la **clé secrète** (`sk_test_…`) et collez-la dans `.env.local` :

   ```
   STRIPE_SECRET_KEY=sk_test_...
   ```

   (La clé publiable `pk_test_…` n'est pas nécessaire : le paiement se fait sur la page Stripe.)

5. Recommandé : **Paramètres → Image de marque (Branding)** pour ajouter votre nom, vos couleurs
   (jaune `#FFD500`, vert `#00843D`) et une icône sur la page de paiement Stripe.

---

## 3. Lancer le site en local

```bash
npm run dev
```

Ouvrez <http://localhost:3000>. Choisissez une taille, une quantité, puis « Payer ma commande » :
vous êtes redirigé vers la page de paiement Stripe.

### Tester un paiement avec une carte de test

Sur la page Stripe, utilisez :

| Champ | Valeur |
| --- | --- |
| Numéro de carte | `4242 4242 4242 4242` (paiement accepté) |
| Date d'expiration | n'importe quelle date future, ex. `12/34` |
| CVC | n'importe quels 3 chiffres, ex. `123` |
| Adresse | n'importe quelle adresse en France |

Autres cartes utiles : `4000 0025 0000 3155` (demande une validation 3D Secure),
`4000 0000 0000 9995` (paiement refusé). Liste complète :
<https://docs.stripe.com/testing>.

Après le paiement, vous arrivez sur `/merci` avec le récapitulatif. La commande apparaît dans
Stripe → **Paiements** (la taille et la quantité sont dans les « Métadonnées »).

---

## 4. Recevoir un e-mail à chaque commande (Resend + webhook)

### 4a. Créer la clé Resend

1. Créez un compte sur <https://resend.com> **avec l'adresse e-mail où vous voulez recevoir les
   commandes**.
2. **API Keys → Create API Key**, copiez la clé (`re_…`) dans `.env.local` :

   ```
   RESEND_API_KEY=re_...
   ```

3. Mettez la même adresse dans `config.ts` → `notificationEmail`.

> Sans nom de domaine vérifié, Resend envoie depuis `onboarding@resend.dev` et **uniquement vers
> l'adresse de votre compte Resend**. C'est suffisant pour vos notifications. Si vous avez un nom de
> domaine, vérifiez-le dans Resend → Domains puis changez `RESEND_FROM`
> (ex. `Canarinho Store <commandes@votre-domaine.fr>`).

### 4b. Tester le webhook en local avec la Stripe CLI

Stripe ne peut pas joindre `localhost` directement : la Stripe CLI fait le relais.

1. Installez la CLI : <https://docs.stripe.com/stripe-cli> (macOS : `brew install stripe/stripe-cli/stripe`).
2. Connectez-la à votre compte : `stripe login`
3. Dans un **second terminal** (laissez `npm run dev` tourner dans le premier) :

   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

4. La commande affiche `Your webhook signing secret is whsec_…`. Copiez ce secret dans `.env.local` :

   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. Redémarrez `npm run dev` (Ctrl+C puis relancez), puis refaites un paiement test.
   Dans le terminal `stripe listen`, vous devez voir `checkout.session.completed … [200]`,
   et vous recevez l'e-mail « Nouvelle commande » avec nom, adresse, téléphone, taille, quantité et
   montant.

---

## 5. Déployer sur Vercel

1. Poussez le projet sur GitHub (c'est déjà le cas si vous lisez ceci sur GitHub).
2. Créez un compte sur <https://vercel.com> avec votre compte GitHub.
3. **Add New… → Project**, choisissez ce dépôt, laissez les réglages par défaut (Next.js est détecté).
4. Avant de cliquer sur **Deploy**, ouvrez **Environment Variables** et ajoutez :

   | Nom | Valeur |
   | --- | --- |
   | `STRIPE_SECRET_KEY` | `sk_test_…` (on passera en réel plus tard) |
   | `STRIPE_WEBHOOK_SECRET` | laissez vide pour l'instant, voir étape 6 |
   | `RESEND_API_KEY` | `re_…` |
   | `RESEND_FROM` | `Canarinho Store <onboarding@resend.dev>` |
   | `NEXT_PUBLIC_SITE_URL` | l'adresse de votre site, ex. `https://canarinho-store.vercel.app` |

5. **Deploy**. Notez l'adresse du site (ex. `https://canarinho-store.vercel.app`).
   Si vous ajoutez un nom de domaine (Vercel → Settings → Domains), mettez à jour
   `NEXT_PUBLIC_SITE_URL`.

## 6. Configurer le webhook Stripe pour le site en ligne

1. Stripe (toujours en mode test) → **Développeurs → Webhooks → Ajouter une destination**
   (<https://dashboard.stripe.com/test/webhooks>).
2. Événement à écouter : **`checkout.session.completed`** uniquement.
3. Type de destination : **Point de terminaison webhook**, URL :
   `https://VOTRE-SITE.vercel.app/api/webhook`
4. Une fois créé, cliquez sur **Afficher/Révéler le secret de signature** (`whsec_…`).
5. Vercel → votre projet → **Settings → Environment Variables** → `STRIPE_WEBHOOK_SECRET` = ce secret.
6. **Deployments → ⋯ → Redeploy** (les variables ne sont prises en compte qu'au déploiement suivant).
7. Faites un paiement test sur le site en ligne avec la carte `4242 4242 4242 4242` : vous devez
   recevoir l'e-mail, et Stripe → Webhooks doit afficher une réponse **200**.

---

## 7. Passer en mode réel (vrais paiements)

1. Dans Stripe, **activez votre compte** (bouton « Activer les paiements ») : identité, statut
   (micro-entreprise, etc.), IBAN pour les virements. Stripe vérifie ces informations.
2. Désactivez le mode test (interrupteur en haut du tableau de bord).
3. Récupérez la **clé secrète réelle** `sk_live_…` (Développeurs → Clés API).
4. Recréez le webhook **en mode réel** (étape 6, mêmes réglages) et récupérez son nouveau
   secret `whsec_…` (il est différent de celui du mode test).
5. Vercel → Environment Variables : remplacez `STRIPE_SECRET_KEY` par `sk_live_…` et
   `STRIPE_WEBHOOK_SECRET` par le nouveau secret, puis **Redeploy**.
6. **Reçus clients** : Stripe → **Paramètres → E-mails clients** (<https://dashboard.stripe.com/settings/emails>)
   → activez « Paiements réussis ». Stripe enverra alors automatiquement un reçu au client
   (en mode test, les reçus ne sont pas envoyés automatiquement).
7. Faites un vrai achat de contrôle, puis remboursez-le depuis Stripe → Paiements → Rembourser.

Checklist avant ouverture : pages légales complétées (plus aucun `[À COMPLÉTER]`), vraies photos,
e-mail de notification correct dans `config.ts`, prix vérifié.

---

## Gérer les commandes au quotidien

- **Nouvelle commande** : vous recevez un e-mail. Tous les détails sont aussi dans Stripe →
  Paiements → cliquez sur le paiement (adresse de livraison, téléphone, métadonnées taille/quantité).
- **Remboursement / rétractation** : Stripe → Paiements → le paiement → **Rembourser**.
- **Changer le prix** : modifiez `priceCents` dans `config.ts`, commitez, Vercel redéploie tout seul.
- **Rupture de stock sur une taille** : retirez-la de `sizes` dans `config.ts`.

## Commandes utiles

```bash
npm run dev        # site en local sur http://localhost:3000
npm run build      # vérifie que le site se construit sans erreur (comme sur Vercel)
npm run typecheck  # vérification TypeScript
```

## Structure

```
config.ts                  ← tous les réglages de la boutique
app/page.tsx               ← page d'accueil
app/api/checkout/route.ts  ← création de la session Stripe (prix calculé ici)
app/api/webhook/route.ts   ← réception des paiements + e-mail de notification
app/merci, app/annule      ← pages de retour
app/mentions-legales, app/cgv, app/confidentialite
components/OrderForm.tsx   ← choix taille / quantité, total en direct
app/globals.css            ← styles (couleurs, mode sombre)
public/images/             ← photos du produit
```

Le logo Nike et l'écusson de la fédération brésilienne ne sont volontairement pas utilisés.
N'en ajoutez pas sur le site ni sur vos photos d'illustration (photographiez le produit réel).
