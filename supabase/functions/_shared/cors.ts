const developmentOrigins = new Set(['http://127.0.0.1:5173', 'http://localhost:5173']);

function configuredOrigins() {
  return new Set((Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(value => value.trim()).filter(Boolean));
}

export function corsHeaders(origin: string | null) {
  const allowed = configuredOrigins();
  const valid = Boolean(origin && (allowed.has(origin) || developmentOrigins.has(origin)));
  return {
    'Access-Control-Allow-Origin': valid ? origin! : 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

export function originAllowed(origin: string | null) {
  if (!origin) return true;
  const allowed = configuredOrigins();
  return allowed.has(origin) || developmentOrigins.has(origin);
}
