# Canarinho Store — Veste Brésil

Site d'un seul produit (veste Nike Brésil), construit avec Next.js et hébergé sur Netlify.

**Mode actuel : liste d'attente.** Les visiteurs remplissent le formulaire « Je veux cette veste »
(prénom, e-mail, téléphone facultatif, taille, quantité, accord pour être recontacté). Les réponses
arrivent dans **Netlify Forms**. Aucun paiement n'est demandé.

Le paiement en ligne (Stripe Checkout + e-mail de notification Resend) est toujours dans le projet,
mais **désactivé**. Voir [Réactiver le paiement](#7-réactiver-le-paiement-en-ligne-plus-tard).

---

## 0. Ce qu'il faut modifier avant la mise en ligne

1. **`config.ts`** (à la racine) : nom de la boutique, prix indicatif (en centimes : `11990` =
   119,90 €), délais de livraison, **e-mail de contact** (`contactEmail`), liste des photos.
2. **Photos** : déposez vos photos dans `public/images/` (par ex. `veste-1.jpg` … `veste-4.jpg`,
   format portrait 4:5 conseillé, ~1600 × 2000 px), puis mettez à jour les chemins dans `config.ts`
   (`images`). Supprimez ensuite les fichiers `veste-*.svg` (placeholders).
3. **Pages légales** : cherchez `[À COMPLÉTER` dans le dossier `app/` (ils sont surlignés en jaune
   sur le site) et remplacez chaque `<Todo>…</Todo>` par votre texte. Dans la politique de
   confidentialité, vérifiez surtout la **durée de conservation** des réservations (12 mois
   proposés).

---

## 1. Installer et lancer le site sur votre ordinateur

Prérequis : [Node.js](https://nodejs.org) version 20 ou plus (prenez la version « LTS »).

```bash
npm install
npm run dev
```

Ouvrez <http://localhost:3000>.

> **En local, l'envoi du formulaire affiche « L'envoi a échoué » : c'est normal.** Les réponses
> sont reçues par Netlify, qui n'existe que sur le site en ligne. Testez l'envoi après le
> déploiement (étape 4).

Aucune variable d'environnement n'est nécessaire en mode liste d'attente.

---

## 2. Déployer sur Netlify

1. Créez un compte sur <https://app.netlify.com/signup> avec votre compte GitHub.
2. **Add new project → Import an existing project → GitHub**, puis choisissez ce dépôt.
3. Netlify lit le fichier `netlify.toml` : les réglages sont déjà remplis
   (commande `npm run build`, dossier `.next`, adaptateur Next.js). Ne changez rien.
4. Cliquez sur **Deploy**. Après 1 à 2 minutes, votre site est en ligne à une adresse du type
   `https://nom-du-site.netlify.app` (modifiable dans **Site configuration → Change site name**).
5. Nom de domaine personnalisé (facultatif) : **Domain management → Add a domain**.

Ensuite, chaque modification poussée sur la branche `main` de GitHub redéploie le site
automatiquement.

## 3. Activer la réception des formulaires (Netlify Forms)

1. Dans Netlify, ouvrez votre projet → **Forms**.
2. Cliquez sur **Enable form detection** (activer la détection des formulaires).
3. **Redéployez** pour que Netlify détecte le formulaire : **Deploys → Trigger deploy → Deploy site**.
4. Retournez dans **Forms** : le formulaire **`reservation`** doit apparaître dans la liste.

> Netlify détecte le formulaire grâce au fichier `public/__forms.html`. Si vous ajoutez ou renommez
> un champ dans `components/WaitlistForm.tsx`, faites la même modification dans ce fichier.

### Recevoir un e-mail à chaque réservation

1. **Site configuration → Notifications → Emails and webhooks → Form submission notifications**.
2. **Add notification → Email notification**.
3. Saisissez votre adresse e-mail et choisissez le formulaire **`reservation`**. Enregistrez.

## 4. Tester

1. Sur le site en ligne, remplissez le formulaire avec vos propres coordonnées et envoyez-le.
2. Le message « C'est noté, merci ! » s'affiche.
3. Dans Netlify → **Forms → reservation**, la réponse apparaît (prénom, e-mail, téléphone, taille,
   quantité, consentement « oui »), et vous recevez l'e-mail de notification.

Si rien n'apparaît, regardez dans **Forms → Spam submissions** : un envoi de test peut y être classé
par erreur (cliquez sur « Verified submission » pour le récupérer).

---

## 5. Gérer les réservations au quotidien

- **Consulter** : Netlify → Forms → `reservation`.
- **Exporter** (tableur) : bouton **Download as CSV** sur la même page.
- **Supprimer** une réservation (demande d'un visiteur, ou durée de conservation atteinte) :
  ouvrez la réponse → **Delete**. Pensez à supprimer aussi le fichier CSV exporté si vous en avez un.
- **Limites** : l'offre gratuite de Netlify limite le nombre de réponses par mois ; vérifiez-le dans
  **Team settings → Billing / Usage**.
- **Spam** : le formulaire contient un champ piège invisible (« honeypot ») et Netlify filtre
  automatiquement le spam.

## 6. Données personnelles (RGPD) — en bref

- La case « J'accepte d'être recontacté au sujet de cette veste » est **obligatoire** : c'est la base
  légale de la collecte (consentement). Ne l'enlevez pas.
- N'utilisez ces contacts **que pour cette veste** (pas de newsletter, pas de revente de fichier).
- Supprimez les réservations à la fin de la durée indiquée dans la politique de confidentialité.
- Si quelqu'un vous demande de supprimer ses données, faites-le rapidement (étape 5).

---

## 7. Réactiver le paiement en ligne plus tard

Le code Stripe est toujours présent : `app/api/checkout`, `app/api/webhook`, `app/merci`,
`app/annule` et `components/OrderForm.tsx`. Tant que `checkoutEnabled` vaut `false`, ces adresses
répondent « page introuvable » (404).

### 7a. Basculer le site en mode paiement

1. Dans `config.ts` : `checkoutEnabled: true`, et renseignez `notificationEmail` (adresse qui reçoit
   les commandes).
2. Le site affiche alors le bloc « Commander » avec le bouton « Payer ma commande ». Les pages légales
   ajoutent automatiquement les sections paiement et livraison. Relisez les CGV avant d'ouvrir les
   ventes.

### 7b. Stripe : compte et clés

1. Créez un compte sur <https://dashboard.stripe.com/register>. Vous démarrez en **mode test** :
   aucun argent réel ne circule.
2. **Développeurs → Clés API** : copiez la **clé secrète** (`sk_test_…`).
3. En local : `cp .env.example .env.local`, puis collez-la dans `STRIPE_SECRET_KEY`.
4. Recommandé : **Paramètres → Image de marque** pour ajouter vos couleurs (jaune `#FFD500`,
   vert `#00843D`) sur la page de paiement Stripe.

Pour tester un paiement, utilisez la carte `4242 4242 4242 4242`, une date future (ex. `12/34`),
un CVC quelconque (ex. `123`) et une adresse en France. Carte refusée : `4000 0000 0000 9995`.
Liste complète : <https://docs.stripe.com/testing>.

### 7c. E-mail « nouvelle commande » (Resend + webhook)

1. Créez un compte sur <https://resend.com> **avec l'adresse qui doit recevoir les commandes** (la
   même que `notificationEmail`). **API Keys → Create API Key** → collez-la dans `RESEND_API_KEY`.
2. Test en local avec la [Stripe CLI](https://docs.stripe.com/stripe-cli) :
   `stripe login`, puis dans un second terminal
   `stripe listen --forward-to localhost:3000/api/webhook`. Copiez le secret `whsec_…` affiché dans
   `STRIPE_WEBHOOK_SECRET` et redémarrez `npm run dev`.

### 7d. Mise en ligne sur Netlify

1. Stripe → **Développeurs → Webhooks → Ajouter une destination** : événement
   **`checkout.session.completed`**, URL `https://VOTRE-SITE.netlify.app/api/webhook`. Copiez son
   secret de signature (`whsec_…`).
2. Netlify → **Site configuration → Environment variables** : ajoutez `STRIPE_SECRET_KEY`,
   `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `RESEND_FROM` et `NEXT_PUBLIC_SITE_URL`
   (ex. `https://VOTRE-SITE.netlify.app`). Voir `.env.example`.
3. **Deploys → Trigger deploy → Deploy site** : les variables ne sont prises en compte qu'au
   déploiement suivant.
4. Faites un paiement test : vous devez arriver sur `/merci` et recevoir l'e-mail de commande.

### 7e. Passer en mode réel (vrais paiements)

1. Stripe → **Activer les paiements** : identité, statut (micro-entreprise…), IBAN.
2. Quittez le mode test, récupérez la clé `sk_live_…` et recréez le webhook en mode réel (nouveau
   secret `whsec_…`).
3. Remplacez les deux valeurs dans les variables Netlify, puis redéployez.
4. Stripe → **Paramètres → E-mails clients** → activez « Paiements réussis » pour que vos clients
   reçoivent un reçu.
5. Faites un vrai achat de contrôle, puis remboursez-le (Stripe → Paiements → Rembourser).

---

## Commandes utiles

```bash
npm run dev        # site en local sur http://localhost:3000
npm run build      # vérifie que le site se construit sans erreur (comme sur Netlify)
npm run typecheck  # vérification TypeScript
```

## Structure

```
config.ts                    ← tous les réglages (dont checkoutEnabled)
netlify.toml                 ← configuration du déploiement Netlify
app/page.tsx                 ← page d'accueil
components/WaitlistForm.tsx  ← formulaire « Je veux cette veste » (mode liste d'attente)
public/__forms.html          ← déclaration du formulaire pour Netlify Forms
app/confidentialite, app/mentions-legales, app/cgv  ← pages légales
app/globals.css              ← styles (couleurs, mode sombre)
public/images/               ← photos du produit

# Paiement (désactivé tant que checkoutEnabled = false)
components/OrderForm.tsx     ← choix taille / quantité + bouton de paiement
app/api/checkout/route.ts    ← création de la session Stripe (prix calculé côté serveur)
app/api/webhook/route.ts     ← réception des paiements + e-mail Resend
app/merci, app/annule        ← pages de retour après paiement
```

Le logo Nike et l'écusson de la fédération brésilienne ne sont volontairement pas utilisés.
N'en ajoutez pas sur le site ni sur vos visuels (photographiez le produit réel).
