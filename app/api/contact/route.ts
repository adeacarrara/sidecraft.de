import { NextResponse } from "next/server";
import { storageReady } from "@/lib/redis";
import { isNoShow, isValidSlot, NO_SHOW_FEE, releaseSlot, reserveSlot } from "@/lib/booking";

/**
 * Reçoit les commandes ("order") et les messages ("message") du site et les envoie
 * par e-mail avec Resend (https://resend.com), sans jamais ouvrir la messagerie du visiteur.
 * Pour une commande, le créneau est d'abord réservé dans la base : il devient indisponible pour tout le monde.
 * Les clés restent côté serveur : elles ne sont jamais envoyées au navigateur.
 */
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OFFERS = ["p1", "p2", "p3"];

type Payload = { kind?: string; message?: string; replyTo?: string; lang?: string; slot?: string; offer?: string };

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

async function sendEmail(apiKey: string, payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function slotLabel(slot: string, de: boolean): string {
  const [date, time] = slot.split("|");
  const [y, m, d] = date.split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString(de ? "de-DE" : "fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
  return `${day} · ${time} (${de ? "deutsche Zeit" : "heure d’Allemagne"})`;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return fail("not_configured", 503);

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return fail("invalid_json", 400);
  }

  const kind = body.kind === "order" ? "order" : "message";
  const message = String(body.message ?? "").trim().slice(0, 8000);
  const replyTo = String(body.replyTo ?? "").trim().slice(0, 200);
  const de = body.lang === "de";
  if (!message || !EMAIL_RE.test(replyTo)) return fail("invalid_fields", 400);

  // ---------- Message simple (bouton « Nous contacter ») ----------
  if (kind === "message") {
    const sent = await sendEmail(apiKey, { from, to: [to], reply_to: replyTo, subject: "Nouveau message", text: message });
    return sent ? NextResponse.json({ ok: true }) : fail("send_failed", 502);
  }

  // ---------- Commande avec créneau ----------
  if (!storageReady()) return fail("booking_not_configured", 503);
  const slot = String(body.slot ?? "");
  const offer = OFFERS.includes(String(body.offer)) ? String(body.offer) : "p2";
  if (!isValidSlot(slot)) return fail("invalid_slot", 400);

  let fee = 0;
  try {
    fee = (await isNoShow(replyTo)) ? NO_SHOW_FEE : 0;
    const booked = await reserveSlot({
      slot, email: replyTo, offer, lang: de ? "de" : "fr",
      createdAt: new Date().toISOString(), status: "confirmed", fee, paid: fee === 0,
    });
    if (!booked) return fail("slot_taken", 409);
  } catch {
    return fail("storage_error", 502);
  }

  const payUrl = fee ? process.env.NOSHOW_PAYMENT_URL || "" : "";
  const ownerText =
    `${message}\n\n— Réservation enregistrée —\nCréneau : ${slotLabel(slot, false)}\n` +
    (fee ? `Frais : ${fee} € À PAYER (client absent à un précédent rendez-vous)\n` : "Devis gratuit (premier rendez-vous)\n") +
    `Gestion des rendez-vous : /admin`;

  const sent = await sendEmail(apiKey, { from, to: [to], reply_to: replyTo, subject: "Nouvelle commande", text: ownerText });
  if (!sent) {
    // L'e-mail n'est pas parti : on libère le créneau pour ne pas le bloquer inutilement.
    await releaseSlot(slot).catch(() => undefined);
    return fail("send_failed", 502);
  }

  // Confirmation au client (désactivable avec SEND_CLIENT_CONFIRMATION=false).
  if (process.env.SEND_CLIENT_CONFIRMATION !== "false") {
    const lines = de
      ? [
          "Vielen Dank für Ihre Bestellung bei sidecraft.de!",
          "",
          `Ihr Termin: ${slotLabel(slot, true)}`,
          "",
          `Das Angebot ist kostenlos, wenn Sie diesen Termin wahrnehmen. Bei Nichterscheinen kostet jeder neue Termin ${NO_SHOW_FEE} €.`,
          ...(fee ? ["", `Aufgrund eines verpassten Termins kostet dieser Termin ${fee} €.${payUrl ? ` Zahlung: ${payUrl}` : " Den Zahlungslink senden wir Ihnen separat."}`] : []),
          "",
          "Ihre Zusammenfassung:",
          "",
          message,
        ]
      : [
          "Merci pour votre commande sur sidecraft.de !",
          "",
          `Votre rendez-vous : ${slotLabel(slot, false)}`,
          "",
          `Le devis est gratuit si vous êtes présent à ce rendez-vous. En cas d’absence, tout nouveau rendez-vous est facturé ${NO_SHOW_FEE} €.`,
          ...(fee ? ["", `Suite à une absence précédente, ce rendez-vous est facturé ${fee} €.${payUrl ? ` Paiement : ${payUrl}` : " Le lien de paiement vous sera envoyé séparément."}`] : []),
          "",
          "Votre récapitulatif :",
          "",
          message,
        ];
    await sendEmail(apiKey, {
      from,
      to: [replyTo],
      reply_to: to,
      subject: de ? "Ihr Termin bei sidecraft.de" : "Votre rendez-vous sidecraft.de",
      text: lines.join("\n"),
    });
  }

  return NextResponse.json({ ok: true, fee, payUrl: payUrl || undefined });
}
