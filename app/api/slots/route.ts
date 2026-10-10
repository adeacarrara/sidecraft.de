import { NextResponse } from "next/server";
import { listBookedSlots } from "@/lib/booking";
import { storageReady } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Liste des créneaux déjà pris, pour les griser dans le questionnaire. */
export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  if (!storageReady()) return NextResponse.json({ booked: [], configured: false }, { headers });
  try {
    return NextResponse.json({ booked: await listBookedSlots(), configured: true }, { headers });
  } catch {
    return NextResponse.json({ booked: [], configured: true, error: "storage_error" }, { status: 502, headers });
  }
}
