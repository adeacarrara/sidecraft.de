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
Sans `RESEND_API_KEY`, `CONTACT_TO_EMAIL` et `CONTACT_FROM_EMAIL`, le site ouvre la messagerie du visiteur en secours.
