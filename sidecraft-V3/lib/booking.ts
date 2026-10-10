import siteData from "@/content/site-data.json";
import { redis } from "@/lib/redis";

/** Frais facturés pour reprendre un rendez-vous après une absence. */
export const NO_SHOW_FEE = 50;

export type Booking = {
  slot: string; // "AAAA-MM-JJ|HH:MM" (heure d'Allemagne)
  email: string;
  offer: string;
  lang: string;
  createdAt: string;
  status: "confirmed" | "noshow";
  fee: number; // 0 ou 50
  paid: boolean;
};

const SLOTS_SET = "sc:slots";
const NOSHOW_SET = "sc:noshow";
const slotKey = (slot: string) => `sc:slot:${slot}`;

export const normalizeEmail = (e: string) => e.trim().toLowerCase();

/** Date du jour à Berlin, format AAAA-MM-JJ. */
export function berlinToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(new Date());
}

/** Vérifie qu'un créneau correspond aux jours, heures et horizon définis dans content/site-data.json. */
export function isValidSlot(slot: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})\|(\d{2}:\d{2})$/.exec(slot);
  if (!m) return false;
  const [, y, mo, d, time] = m;
  const times = siteData.book.times.split(",").map((t) => t.trim());
  if (!times.includes(time)) return false;
  const date = Date.UTC(+y, +mo - 1, +d);
  const check = new Date(date);
  if (check.getUTCMonth() !== +mo - 1 || check.getUTCDate() !== +d) return false;
  if (!siteData.book.days.map(Number).includes(check.getUTCDay())) return false;
  const [ty, tm, td] = berlinToday().split("-").map(Number);
  const diffDays = (date - Date.UTC(ty, tm - 1, td)) / 86_400_000;
  return diffDays >= 0 && diffDays <= siteData.book.horizon + 1;
}

/** Créneaux déjà réservés (à partir d'aujourd'hui), sans aucune donnée personnelle. */
export async function listBookedSlots(): Promise<string[]> {
  const all = (await redis<string[]>("SMEMBERS", SLOTS_SET)) || [];
  const today = berlinToday();
  return all.filter((s) => s.slice(0, 10) >= today).sort();
}

export async function isNoShow(email: string): Promise<boolean> {
  return (await redis<number>("SISMEMBER", NOSHOW_SET, normalizeEmail(email))) === 1;
}

/** Réserve le créneau de façon atomique : renvoie null s'il est déjà pris. */
export async function reserveSlot(b: Booking): Promise<Booking | null> {
  const ok = await redis<string | null>("SET", slotKey(b.slot), JSON.stringify(b), "NX");
  if (ok !== "OK") return null;
  await redis("SADD", SLOTS_SET, b.slot);
  return b;
}

export async function releaseSlot(slot: string): Promise<void> {
  await redis("DEL", slotKey(slot));
  await redis("SREM", SLOTS_SET, slot);
}

export async function getBooking(slot: string): Promise<Booking | null> {
  const raw = await redis<string | null>("GET", slotKey(slot));
  return raw ? (JSON.parse(raw) as Booking) : null;
}

export async function saveBooking(b: Booking): Promise<void> {
  await redis("SET", slotKey(b.slot), JSON.stringify(b));
}

export async function listBookings(): Promise<Booking[]> {
  const slots = ((await redis<string[]>("SMEMBERS", SLOTS_SET)) || []).sort();
  const out: Booking[] = [];
  for (const s of slots) {
    const b = await getBooking(s);
    if (b) out.push(b);
  }
  return out;
}

export async function markNoShow(slot: string): Promise<void> {
  const b = await getBooking(slot);
  if (!b) return;
  await saveBooking({ ...b, status: "noshow" });
  await redis("SADD", NOSHOW_SET, normalizeEmail(b.email));
}

export async function listNoShows(): Promise<string[]> {
  return ((await redis<string[]>("SMEMBERS", NOSHOW_SET)) || []).sort();
}

export async function forgiveNoShow(email: string): Promise<void> {
  await redis("SREM", NOSHOW_SET, normalizeEmail(email));
}
