import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const migrations = [
  '003_roles_and_profiles.sql',
  '004_child_management_foundation.sql',
  '005_parent_portal_access.sql',
  '006_owner_console_security.sql',
  '007_identity_provisioning.sql',
  '008_child_consents.sql',
  '009_child_health_basics.sql',
];

const sections = [
  '-- Early Years live Supabase repair bundle',
  '-- Generated from canonical migrations 003–009. Apply once in the Supabase SQL Editor.',
  '-- Re-running is supported by the idempotent migrations and explicit policy replacement.',
];
for (const name of migrations) {
  const sql = await readFile(join(root, 'supabase', 'migrations', name), 'utf8');
  sections.push(`\n-- ── ${name} ──\n`, sql.trim(), '\n');
}

const output = join(root, 'supabase', 'LIVE_REPAIR_003_009.sql');
await writeFile(output, `${sections.join('\n')}\n`);
console.log(`Prepared ${migrations.length} migrations in supabase/LIVE_REPAIR_003_009.sql`);
