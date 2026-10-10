# sidecraft.de – site Next.js

Site vitrine de sidecraft.de : Next.js (App Router) + TypeScript, prêt pour GitHub et Vercel.

## Structure

```
app/
  layout.tsx            Polices, SEO (titre, description, canonical, Open Graph)
  page.tsx              Page d'accueil (assemble les sections)
  globals.css           Tout le design (verre liquide, animations, responsive)
  api/contact/route.ts  Envoi des commandes et messages par e-mail (Resend)
  robots.ts / sitemap.ts
  impressum/ datenschutz/   Pages légales à compléter (non indexées pour l'instant)
  not-found.tsx         Page 404
components/             Une section du site par fichier (en-tête, slogan, exemples, équipe, prix…)
content/site-data.json  Prix, e-mail, jours et heures des appels, textes du questionnaire
public/js/site.js       Interactions : FR/DE, exemples, questionnaire, contact, animations
.env.example            Liste des variables à configurer (sans valeurs secrètes)
```

## Modifier le contenu

- **Prix, e-mail, créneaux** : `content/site-data.json`
- **Textes en français** : fichiers de `components/` (chaque texte a un attribut `data-i`)
- **Textes en allemand** : objet `DE` au début de `public/js/site.js` (même clé `data-i`)

Après chaque modification envoyée sur GitHub, Vercel republie le site automatiquement.

## Commandes

```
npm install      # installe les dépendances (une seule fois)
npm run dev      # lance le site sur http://localhost:3000
npm run build    # vérifie que le site se construit pour la production
npm run start    # lance la version de production en local
```

## Variables d'environnement

Copiez `.env.example` en `.env.local` (sur votre ordinateur) et ajoutez les mêmes variables dans Vercel.

| Fonction | Variables | Service |
|---|---|---|
| Envoi des commandes et messages (jamais via l'app Mail du visiteur) | `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Resend |
| Créneaux réservés pour tout le monde | `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Upstash Redis (Vercel > Storage) |
| Page privée `/admin` | `ADMIN_PASSWORD` | – |
| Lien de paiement des 50 € (optionnel) | `NOSHOW_PAYMENT_URL` | Stripe Payment Link par ex. |

Sans Resend, l'envoi affiche un message d'erreur dans le site. Sans Upstash, les commandes avec créneau sont refusées
(sinon deux clients pourraient réserver le même créneau).

## Rendez-vous et absences

- Un créneau validé est enregistré dans la base et grisé pour tous les visiteurs.
- Page privée **/admin** (mot de passe `ADMIN_PASSWORD`) : liste des rendez-vous, boutons **Absent**, **Payé**, **Libérer**.
- **Absent** : l'e-mail du client est mémorisé ; chacun de ses prochains rendez-vous est marqué « 50 € à payer »,
  le client en est informé à l'écran et par e-mail (avec le lien `NOSHOW_PAYMENT_URL` s'il est renseigné).
- **Retirer la pénalité** : le client redevient gratuit.
- Le client est reconnu par son adresse e-mail.
