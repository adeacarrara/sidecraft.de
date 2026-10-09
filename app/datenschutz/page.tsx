import type { Metadata } from "next";
import Background from "@/components/Background";

// Modèle de structure : à faire relire par un professionnel avant publication, puis passer index à true.
export const metadata: Metadata = { title: "Datenschutzerklärung", alternates: { canonical: "/datenschutz" }, robots: { index: false, follow: true } };

const Todo = ({ children }: { children: string }) => <span className="todo">{children}</span>;

export default function DatenschutzPage() {
  return (
    <>
      <Background />
      <main className="legal">
        <h1>Datenschutzerklärung</h1>
        <h2>Verantwortliche Stelle</h2>
        <p><Todo>[Name, Anschrift, E-Mail]</Todo></p>
        <h2>Hosting</h2>
        <p>Diese Website wird bei Vercel Inc. gehostet. <Todo>[Angaben zu Server-Logfiles und Auftragsverarbeitung ergänzen]</Todo></p>
        <h2>Bestell- und Kontaktformular</h2>
        <p>Ihre Angaben (E-Mail-Adresse, Nachricht, gewählte Optionen und Termin) werden zur Bearbeitung Ihrer Anfrage per E-Mail über den Dienst Resend an uns übermittelt. <Todo>[Rechtsgrundlage und Speicherdauer ergänzen]</Todo></p>
        <h2>Schriftarten</h2>
        <p>Die Schriftarten werden lokal von dieser Website geladen; es findet keine Verbindung zu Google-Servern statt.</p>
        <h2>Ihre Rechte</h2>
        <p><Todo>[Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit, Beschwerderecht]</Todo></p>
        <p><a href="/">← sidecraft.de</a></p>
      </main>
    </>
  );
}
