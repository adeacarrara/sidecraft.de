/**
 * Accès à la base Redis (Upstash) par son API REST, sans dépendance supplémentaire.
 * Variables créées automatiquement par l'intégration Upstash de Vercel
 * (KV_REST_API_URL / KV_REST_API_TOKEN) ou saisies à la main (UPSTASH_REDIS_REST_*).
 */
// Accepte aussi les noms avec un préfixe choisi lors de la connexion dans Vercel
// (ex. MONPREFIXE_KV_REST_API_URL). Le jeton « READ_ONLY » est ignoré : il ne permet pas d'écrire.
function findEnv(...suffixes: string[]): string | undefined {
  for (const s of suffixes) if (process.env[s]) return process.env[s];
  const key = Object.keys(process.env).find((k) => suffixes.some((s) => k.endsWith(`_${s}`)) && !k.includes("READ_ONLY"));
  return key ? process.env[key] : undefined;
}

const URL_ = findEnv("KV_REST_API_URL", "UPSTASH_REDIS_REST_URL");
const TOKEN = findEnv("KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN");

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
