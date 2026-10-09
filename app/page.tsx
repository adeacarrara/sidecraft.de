import siteData from "@/content/site-data.json";
import Background from "@/components/Background";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Examples from "@/components/Examples";
import Team from "@/components/Team";
import Pricing from "@/components/Pricing";
import SiteFooter from "@/components/SiteFooter";
import Overlays from "@/components/Overlays";
import LegacyBoot from "@/components/LegacyBoot";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export default function HomePage() {
  // Données structurées : uniquement des informations réelles (aucune adresse, aucun avis inventé).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    knowsLanguage: ["de", "fr"],
    founder: [
      { "@type": "Person", name: "Ashley", jobTitle: "Sales & Business Development" },
      { "@type": "Person", name: "Adea", jobTitle: "Creative & Web Design" },
    ],
    makesOffer: [
      { "@type": "Offer", name: "Google-Profil", price: String(siteData.prices.p1), priceCurrency: "EUR" },
      { "@type": "Offer", name: "Unternehmenswebsite (bis zu 10 Seiten)", price: String(siteData.prices.p2), priceCurrency: "EUR" },
      { "@type": "Offer", name: "Komplette Website (bis zu 20 Seiten)", price: String(siteData.prices.p3), priceCurrency: "EUR" },
    ],
  };

  return (
    <>
      <Background />
      <SiteHeader />
      <main id="top">
        <Hero />
        <Examples />
        <Team />
        <Pricing />
      </main>
      <SiteFooter />
      <Overlays />
      {/* Contenu modifiable (prix, e-mail, créneaux, textes) : voir content/site-data.json */}
      <script id="site-data" type="application/json" dangerouslySetInnerHTML={{ __html: json(siteData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(jsonLd) }} />
      <LegacyBoot />
    </>
  );
}
