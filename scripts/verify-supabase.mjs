import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const env = { ...process.env };
for (const name of ['.env.local', '.env']) {
  const path = resolve(process.cwd(), name);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match || match[2].startsWith('#')) continue;
    env[match[1]] ??= match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

const url = env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const anonKey = env.VITE_SUPABASE_ANON_KEY;
if (!url || !anonKey || url.includes('YOUR_PROJECT')) {
  console.error('Supabase verification skipped: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.');
  process.exit(2);
}

const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` };
const services = [
  ['Published CMS', 'cms_published'],
  ['Draft CMS', 'cms_drafts'],
  ['Site settings', 'site_settings'],
  ['Popups', 'site_popups'],
  ['Public submissions', 'submissions'],
  ['Image metadata', 'global_assets'],
  ['Image versions', 'asset_versions'],
  ['Publications', 'publications'],
  ['CMS claims', 'cms_claims'],
  ['Profiles and roles', 'profiles'],
  ['Children', 'children'],
  ['Family links', 'child_guardians'],
  ['Classrooms', 'classrooms'],
  ['Staff assignments', 'staff_classroom_assignments'],
  ['Classroom memberships', 'classroom_memberships'],
  ['Attendance', 'attendance_records'],
  ['Learning updates', 'family_updates'],
  ['Family messages', 'family_messages'],
  ['Parent consents', 'child_consents'],
  ['Daily care reports', 'child_daily_reports'],
  ['Daily care audit history', 'child_daily_report_revisions'],
  ['Workspace invitations', 'workspace_invitations'],
];

const failures = [];
async function probe(label, endpoint, init = {}) {
  try {
    const response = await fetch(`${url}${endpoint}`, {
      ...init,
      headers: { ...headers, ...init.headers },
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) {
      failures.push(`${label} (HTTP ${response.status})`);
      console.error(`✗ ${label}`);
      return null;
    }
    console.log(`✓ ${label}`);
    return response;
  } catch {
    failures.push(`${label} (unreachable)`);
    console.error(`✗ ${label}`);
    return null;
  }
}

await probe('Supabase Auth', '/auth/v1/settings');
for (const [label, table] of services) {
  await probe(label, `/rest/v1/${table}?select=*&limit=0`);
}
const portal = await probe('Shared Parent Portal RPC', '/rest/v1/rpc/verify_parent_portal_pin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ candidate_pin: '__readiness_probe_invalid__' }),
});
if (portal && (await portal.text()).trim() !== 'false') {
  failures.push('Shared Parent Portal RPC returned an unsafe readiness result');
  console.error('✗ Shared Parent Portal rejected an invalid readiness PIN incorrectly');
}

if (failures.length) {
  console.error(`\nSupabase readiness failed (${failures.length}): ${failures.join(', ')}`);
  process.exit(1);
}
console.log(`\nSupabase readiness passed: Auth, ${services.length} tables, and the Parent Portal RPC are reachable with public-client permissions.`);
