import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { storageReady } from "@/lib/redis";
import { forgiveNoShow, getBooking, listBookings, listNoShows, markNoShow, releaseSlot, saveBooking } from "@/lib/booking";

/** Gestion des rendez-vous, protégée par le mot de passe ADMIN_PASSWORD. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  const given = request.headers.get("x-admin-key") || "";
  if (!expected || expected.length < 10) return false;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

async function state() {
  return NextResponse.json(
    { ok: true, bookings: await listBookings(), noShows: await listNoShows() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!storageReady()) return NextResponse.json({ ok: false, error: "booking_not_configured" }, { status: 503 });
  return state();
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!storageReady()) return NextResponse.json({ ok: false, error: "booking_not_configured" }, { status: 503 });
  const { action, slot = "", email = "" } = (await request.json().catch(() => ({}))) as {
    action?: string; slot?: string; email?: string;
  };
  if (action === "noshow") await markNoShow(slot);
  else if (action === "cancel") await releaseSlot(slot);
  else if (action === "paid") {
    const b = await getBooking(slot);
    if (b) await saveBooking({ ...b, paid: true });
  } else if (action === "forgive") await forgiveNoShow(email);
  else return NextResponse.json({ ok: false, error: "unknown_action" }, { status: 400 });
  return state();
}
