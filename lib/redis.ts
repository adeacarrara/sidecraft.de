/**
 * Accès à la base Redis (Upstash) par son API REST, sans dépendance supplémentaire.
 * Variables créées automatiquement par l'intégration Upstash de Vercel
 * (KV_REST_API_URL / KV_REST_API_TOKEN) ou saisies à la main (UPSTASH_REDIS_REST_*).
 */
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const storageReady = (): boolean => Boolean(URL_ && TOKEN);

export async function redis<T = unknown>(...command: (string | number)[]): Promise<T> {
  if (!URL_ || !TOKEN) throw new Error("storage_not_configured");
  const res = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command.map(String)),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as { result?: T; error?: string };
  if (!res.ok || json.error) throw new Error(json.error || `redis_${res.status}`);
  return json.result as T;
}
