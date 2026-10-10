"use client";

import { useState } from "react";

type Booking = {
  slot: string; email: string; offer: string; lang: string; createdAt: string;
  status: "confirmed" | "noshow"; fee: number; paid: boolean;
};
type State = { bookings: Booking[]; noShows: string[] };

const OFFERS: Record<string, string> = { p1: "500 €", p2: "1 500 €", p3: "2 000 €" };

function label(slot: string) {
  const [date, time] = slot.split("|");
  const [y, m, d] = date.split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("fr-FR", {
    weekday: "short", day: "numeric", month: "short", timeZone: "UTC",
  });
  return `${day} · ${time}`;
}

/** Page privée : liste des rendez-vous, absences et pénalités de 50 €. */
export default function AdminPanel() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<State | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function call(method: "GET" | "POST", body?: object) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        method,
        headers: { "x-admin-key": key, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          json.error === "unauthorized" ? "Mot de passe incorrect."
          : json.error === "booking_not_configured" ? "La base de réservations n’est pas configurée (voir README)."
          : "Erreur, réessayez.",
        );
        if (json.error === "unauthorized") setData(null);
      } else setData({ bookings: json.bookings, noShows: json.noShows });
    } catch {
      setError("Connexion impossible.");
    } finally {
      setBusy(false);
    }
  }

  const act = (action: string, extra: object, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    void call("POST", { action, ...extra });
  };

  if (!data) {
    return (
      <form className="adm-login" onSubmit={(e) => { e.preventDefault(); void call("GET"); }}>
        <label>Mot de passe
          <input type="password" value={key} onChange={(e) => setKey(e.target.value)} autoComplete="current-password" />
        </label>
        <button type="submit" className="pb2" disabled={busy || !key}>{busy ? "…" : "Ouvrir"}</button>
        {error && <p className="err">{error}</p>}
      </form>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = data.bookings.filter((b) => b.slot.slice(0, 10) >= today);
  const past = data.bookings.filter((b) => b.slot.slice(0, 10) < today).reverse();

  const row = (b: Booking) => (
    <li key={b.slot} className={`glass adm-row${b.status === "noshow" ? " ns" : ""}`}>
      <div>
        <b>{label(b.slot)}</b>
        <span>{b.email} · {OFFERS[b.offer] ?? b.offer} · {b.lang.toUpperCase()}</span>
        <span>
          {b.status === "noshow" ? "Absent" : "Confirmé"}
          {b.fee ? ` · ${b.fee} € ${b.paid ? "payés" : "à payer"}` : " · devis gratuit"}
        </span>
      </div>
      <div className="adm-act">
        {b.status !== "noshow" && (
          <button type="button" onClick={() => act("noshow", { slot: b.slot }, `Marquer ${b.email} comme absent ? Ses prochains rendez-vous coûteront 50 €.`)}>Absent</button>
        )}
        {b.fee > 0 && !b.paid && <button type="button" onClick={() => act("paid", { slot: b.slot })}>Payé</button>}
        <button type="button" onClick={() => act("cancel", { slot: b.slot }, "Annuler ce rendez-vous et libérer le créneau ?")}>Libérer</button>
      </div>
    </li>
  );

  return (
    <div className="adm-wrap">
      {error && <p className="err">{error}</p>}
      <p><button type="button" className="pb2" onClick={() => call("GET")} disabled={busy}>{busy ? "…" : "Actualiser"}</button></p>
      <h2>À venir ({upcoming.length})</h2>
      {upcoming.length ? <ul className="adm-list">{upcoming.map(row)}</ul> : <p>Aucun rendez-vous à venir.</p>}
      <h2>Passés</h2>
      {past.length ? <ul className="adm-list">{past.map(row)}</ul> : <p>Aucun.</p>}
      <h2>Clients absents (50 € par nouveau rendez-vous)</h2>
      {data.noShows.length ? (
        <ul className="adm-list">
          {data.noShows.map((e) => (
            <li key={e} className="glass adm-row">
              <div><b>{e}</b></div>
              <div className="adm-act">
                <button type="button" onClick={() => act("forgive", { email: e }, `Retirer la pénalité de ${e} ?`)}>Retirer la pénalité</button>
              </div>
            </li>
          ))}
        </ul>
      ) : <p>Aucun.</p>}
    </div>
  );
}
