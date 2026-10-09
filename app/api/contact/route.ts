import { NextResponse } from "next/server";

/**
 * Reçoit les commandes ("order") et les messages ("message") du site
 * et les envoie par e-mail avec Resend (https://resend.com).
 * Les clés restent côté serveur : elles ne sont jamais envoyées au navigateur.
 */
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = { kind?: string; message?: string; replyTo?: string; lang?: string };

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    // Non configuré : le site ouvrira la messagerie du visiteur à la place.
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const kind = body.kind === "order" ? "order" : "message";
  const message = String(body.message ?? "").trim().slice(0, 8000);
  const replyTo = String(body.replyTo ?? "").trim().slice(0, 200);
  const de = body.lang === "de";
  if (!message || !EMAIL_RE.test(replyTo)) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  }

  const subject = kind === "order" ? "Nouvelle commande" : "Nouveau message";
  const res = await sendEmail(apiKey, { from, to: [to], reply_to: replyTo, subject, text: message });
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  // Confirmation au client (optionnelle, nécessite un domaine vérifié dans Resend).
  if (kind === "order" && process.env.SEND_CLIENT_CONFIRMATION === "true") {
    const intro = de
      ? "Vielen Dank für Ihre Bestellung bei sidecraft.de! Wir melden uns in Kürze. Hier Ihre Zusammenfassung:"
      : "Merci pour votre commande sur sidecraft.de ! Nous revenons vers vous très vite. Voici votre récapitulatif :";
    await sendEmail(apiKey, {
      from,
      to: [replyTo],
      reply_to: to,
      subject: de ? "Ihre Bestellung bei sidecraft.de" : "Votre commande sidecraft.de",
      text: `${intro}\n\n${message}`,
    }).catch(() => undefined);
  }

  return NextResponse.json({ ok: true });
}
