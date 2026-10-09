import type { Metadata } from "next";
import Background from "@/components/Background";

// À compléter avec vos vraies informations, puis passer index à true.
export const metadata: Metadata = { title: "Impressum", alternates: { canonical: "/impressum" }, robots: { index: false, follow: true } };

const Todo = ({ children }: { children: string }) => <span className="todo">{children}</span>;

export default function ImpressumPage() {
  return (
    <>
      <Background />
      <main className="legal">
        <h1>Impressum</h1>
        <h2>Angaben gemäß § 5 DDG</h2>
        <p><Todo>[Vollständiger Name bzw. Firmenname]</Todo><br /><Todo>[Straße und Hausnummer]</Todo><br /><Todo>[PLZ Ort]</Todo></p>
        <h2>Kontakt</h2>
        <p>E-Mail: <Todo>[E-Mail-Adresse]</Todo><br />Telefon: <Todo>[Telefonnummer]</Todo></p>
        <h2>Umsatzsteuer-ID</h2>
        <p><Todo>[USt-IdNr., falls vorhanden – sonst Abschnitt entfernen]</Todo></p>
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p><Todo>[Name, Anschrift]</Todo></p>
        <p><a href="/">← sidecraft.de</a></p>
      </main>
    </>
  );
}
