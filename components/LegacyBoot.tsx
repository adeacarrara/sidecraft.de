"use client";

import { useEffect } from "react";

/** Charge public/js/site.js une seule fois, après l'affichage de la page par React.
 *  Ce script gère : langues FR/DE, exemples de sites, questionnaire de commande,
 *  fenêtre de contact, animations du slogan, étincelles et compteur des prix. */
export default function LegacyBoot() {
  useEffect(() => {
    if (document.getElementById("sidecraft-site-js")) return;
    const s = document.createElement("script");
    s.id = "sidecraft-site-js";
    s.src = "/js/site.js";
    s.async = false;
    document.body.appendChild(s);
  }, []);
  return null;
}
