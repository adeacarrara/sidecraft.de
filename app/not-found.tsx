import type { Metadata } from "next";
import Background from "@/components/Background";

export const metadata: Metadata = { title: "404", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <>
      <Background />
      <main className="legal">
        <h1>404</h1>
        <p>Cette page n’existe pas. · Diese Seite existiert nicht.</p>
        {/* Lien classique (rechargement complet) pour relancer les animations de l'accueil */}
        <p><a href="/">← sidecraft.de</a></p>
      </main>
    </>
  );
}
