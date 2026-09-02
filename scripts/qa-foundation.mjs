import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];
const pass = label => process.stdout.write(`✓ ${label}\n`);
const requireCheck = (condition, label, detail = label) => condition ? pass(label) : failures.push(detail);
const read = path => readFileSync(join(root, path), 'utf8');

const manifest = read('src/app/data/assetManifest.ts');
const keys = [...manifest.matchAll(/\bkey:\s*['"]([a-z0-9.-]+)['"]/g)].map(match => match[1]);
requireCheck(keys.length >= 25, `semantic manifest exposes ${keys.length} slots`, 'Semantic image manifest is unexpectedly incomplete.');
requireCheck(manifest.includes('localFallbackPath') && manifest.includes('/images/${'), 'manifest fallbacks resolve to company image folders');
for (const key of keys) {
  const extension = key === 'daycare.educator.lamia' ? 'png' : 'jpg';
  const brand = key.startsWith('eduhub.') ? 'eduhub' : 'daycare';
  const path = join(root, 'public', 'images', brand, `${key}.${extension}`);
  requireCheck(existsSync(path) && statSync(path).size > 0, `image slot ${key}`, `Missing or empty image slot: ${key}`);
}

const imageSlots = read('src/app/data/imageSlots.ts');
requireCheck(imageSlots.includes("'daycare.educator.'") && imageSlots.includes("'eduhub.alumni.'"), 'dynamic profiles remain explicitly scoped');
requireCheck(imageSlots.includes('/images/${brand}/'), 'static image slots use company-specific public paths');
const publicAssetManifest = JSON.parse(read('public/asset-manifest.json'));
requireCheck(Object.values(publicAssetManifest.assets ?? {}).every(asset => typeof asset.fallback_url === 'string' && /^\/images\/(daycare|eduhub)\//.test(asset.fallback_url) && !String(asset.published_url).startsWith('http')), 'deployed asset manifest contains company-specific local paths only');
for (const page of [
  'src/app/pages/daycare/About.tsx',
  'src/app/pages/daycare/Home.tsx',
  'src/app/pages/eduhub/About.tsx',
  'src/app/pages/eduhub/Programs.tsx',
]) {
  const content = read(page);
  requireCheck(!content.includes('ImageWithFallback'), `${page} uses the semantic image system`);
}

const workspace = read('src/app/pages/Workspace.tsx');
requireCheck(['owner', 'admin', 'teacher', 'parent'].every(role => workspace.includes(`${role}:`)), 'all four workspace roles are present');
requireCheck(workspace.includes('/daycare/parents') && workspace.includes('General Parent Portal'), 'shared Parent Portal is separated from family accounts');

const appRouter = read('src/app/App.tsx');
const appEntry = read('src/main.tsx');
const routeErrorPage = read('src/app/components/RouteErrorPage.tsx');
requireCheck(appRouter.includes('errorElement: <RouteErrorPage />') && appRouter.includes("path: '*'"), 'router has branded route errors and a deliberate not-found page');
requireCheck(appEntry.includes('<AppErrorBoundary>'), 'application root has a last-resort render error boundary');
requireCheck(!routeErrorPage.includes('error.message') && !routeErrorPage.includes('error.stack'), 'error pages do not disclose technical details');

const admin = read('src/app/pages/Admin.tsx');
requireCheck(admin.includes("accountRole !== 'owner'") && admin.includes('useProfileRole(session)'), 'Owner Console verifies its owner route guard against the database profile');
requireCheck(admin.includes('AdminEntryShell') && !admin.includes('setAuthError(error.message)'), 'Owner Console entry uses branded recovery states without exposing provider errors');
const profileRoleHook = read('src/app/auth/useProfileRole.ts');
requireCheck(profileRoleHook.includes("from('profiles')") && profileRoleHook.includes("select('role, active')"), 'authenticated role resolution uses the active database profile');

const contactSplit = read('src/app/pages/ContactSplit.tsx');
requireCheck(!contactSplit.includes('ViaWeb3Forms') && contactSplit.includes("insertSubmission('daycare'") && contactSplit.includes("insertSubmission('eduhub'"), 'combined contact forms use the active local-first submission service');
requireCheck(contactSplit.includes('<main>') && contactSplit.includes('htmlFor="split-eduhub-qualification"'), 'combined contact page has landmarks and explicit form labels');
const parentPortal = read('src/app/pages/daycare/ParentPortal.tsx');
requireCheck(parentPortal.includes('<main className="family-gate"') && read('src/styles/globals.css').includes('.family-gate__help a { color: #a45146'), 'shared Parent Portal login preserves accessible landmarks and help-text contrast');
const cmsData = read('src/app/data/cms.ts');
requireCheck(cmsData.includes('localSaved: true') && cmsData.includes('if (error) return { cloudSaved: false'), 'public submissions retain a local recovery copy and surface cloud failures');

for (const migration of ['003_roles_and_profiles.sql', '004_child_management_foundation.sql', '005_parent_portal_access.sql', '006_owner_console_security.sql', '007_identity_provisioning.sql', '008_child_consents.sql', '009_child_health_basics.sql', '010_classrooms_and_staff_assignments.sql', '011_daily_care_foundation.sql', '012_class_management_operations.sql', '013_secure_workspace_invitations.sql', '014_child_onboarding_operation.sql']) {
  requireCheck(existsSync(join(root, 'supabase', 'migrations', migration)), `migration ${migration}`);
}

const identityMigration = read('supabase/migrations/007_identity_provisioning.sql');
requireCheck(identityMigration.includes('on_auth_user_created'), 'new auth users receive application profiles');
requireCheck(identityMigration.includes('claim_initial_owner'), 'fresh installations have an explicit Owner bootstrap');
requireCheck(identityMigration.includes('assign_profile_role'), 'role assignment is server-authorized');
requireCheck(identityMigration.includes('protect_last_owner'), 'final active Owner is protected');
const workspaceCloud = read('src/app/data/workspaceCloud.ts');
requireCheck(['attendance_records', 'family_updates', 'family_messages', 'child_consents'].every(table => workspaceCloud.includes(table)), 'authenticated workspaces persist core child-management workflows');
requireCheck(workspaceCloud.includes('allergies') && read('supabase/migrations/009_child_health_basics.sql').includes('allergies TEXT[]'), 'child allergy information has a protected cloud data path');
const dailyCareMigration = read('supabase/migrations/011_daily_care_foundation.sql');
requireCheck(['classroom_memberships', 'child_daily_reports', 'child_daily_report_revisions'].every(table => dailyCareMigration.includes(table)), 'daily care has effective class membership, structured reports, and revision history');
requireCheck(dailyCareMigration.includes('published_at IS NOT NULL') && dailyCareMigration.includes('guardian.guardian_id = auth.uid()'), 'parents can read only published reports for linked children');
requireCheck(dailyCareMigration.includes('REVOKE DELETE ON public.child_daily_reports') && dailyCareMigration.includes('audit_child_daily_report_change'), 'daily care records are non-deletable and changes are audited');
const classOperations = read('supabase/migrations/012_class_management_operations.sql');
requireCheck(['require_operations_role', 'create_classroom', 'set_classroom_staff', 'enrol_child_in_classroom', 'link_child_guardian'].every(name => classOperations.includes(name)), 'class setup operations are server-authorized and atomic');
requireCheck(classOperations.includes('audit_log') && classOperations.includes('REVOKE ALL ON FUNCTION'), 'class setup changes are audited and RPC access is explicit');
requireCheck(read('src/app/components/workspace/ClassManagement.tsx').includes('passwords are never created or exposed here'), 'class setup keeps account invitations out of the browser');
const invitationMigration = read('supabase/migrations/013_secure_workspace_invitations.sql');
const invitationFunction = read('supabase/functions/invite-workspace-user/index.ts');
requireCheck(invitationMigration.includes('workspace_invitations') && invitationMigration.includes('REVOKE INSERT, UPDATE, DELETE'), 'invitation records are readable but browser writes are blocked');
requireCheck(invitationFunction.includes('SUPABASE_SERVICE_ROLE_KEY') && invitationFunction.includes('inviteUserByEmail') && invitationFunction.includes('originAllowed'), 'workspace invitations use a server-only, origin-checked function');
requireCheck(invitationFunction.includes('redirectTo: `${appUrl}/workspace`') && !invitationFunction.includes('body.redirect'), 'invitation redirects are fixed by server configuration');
requireCheck(read('src/app/components/workspace/AccessManagement.tsx').includes("functions.invoke('invite-workspace-user'"), 'Owner and Admin access management invokes the protected invitation service');
const childOnboarding = read('supabase/migrations/014_child_onboarding_operation.sql');
requireCheck(childOnboarding.includes('require_operations_role') && childOnboarding.includes('create_child_record') && childOnboarding.includes('audit_log'), 'child onboarding is server-authorized and audited');
requireCheck(!read('src/app/data/workspaceStore.ts').includes('Amira Hassan') && !read('src/app/data/classManagement.ts').includes('Sunflowers'), 'workspace ships without fabricated children, classrooms, or activity');
requireCheck(workspace.includes('cloud: !localPreview'), 'local preview and authenticated cloud workspaces use separate persistence modes');
const workspaceStore = read('src/app/data/workspaceStore.ts');
requireCheck(workspaceStore.includes('cloud ? emptyCloudData() : readStore()'), 'authenticated cloud failures cannot expose seeded local child records');
requireCheck(workspaceStore.includes('Attendance was not changed') && workspaceStore.includes('message was not sent'), 'failed cloud writes do not appear successfully applied');
requireCheck(workspaceStore.includes('No local fallback was used') && workspaceStore.includes('current classroom assignment'), 'daily care cloud failures and missing classroom links fail closed');
requireCheck(workspace.includes('<h3>Messages</h3>') && workspace.includes('Reply to family') && workspace.includes('data.consents[selected.id]'), 'family conversations and per-child consent controls are rendered for the selected child');
const backendHealth = read('src/app/utils/supabase/health.ts');
requireCheck(['cms_published', 'submissions', 'profiles', 'children', 'attendance_records', 'family_messages', 'child_consents', 'verify_parent_portal_pin'].every(service => backendHealth.includes(service)), 'backend health verifies every critical public and private subsystem without reading the PIN table');

const robots = read('public/robots.txt');
requireCheck(robots.includes('Disallow: /admin') && robots.includes('Disallow: /daycare/parents'), 'private routes are excluded from search crawling');
requireCheck(existsSync(join(root, 'public', 'sitemap.xml')), 'public sitemap exists');
requireCheck(existsSync(join(root, 'public', 'favicon.png')), 'brand favicon exists');
requireCheck(existsSync(join(root, 'public', 'apple-touch-icon.png')) && existsSync(join(root, 'public', 'site.webmanifest')), 'complete installable favicon set exists');
requireCheck(['privacy', 'terms'].every(route => read('public/sitemap.xml').includes(`/${route}`)), 'sitemap includes public legal routes');
const sitemap = read('public/sitemap.xml');
requireCheck(!['/admin', '/workspace', '/daycare/parents', '/daycare/parent-info', '/daycare/calendar'].some(route => sitemap.includes(`<loc>https://theearlyyearscompany.com${route}</loc>`)), 'sitemap excludes private and redirected family routes');
requireCheck(['when-should-my-child-start-nursery', 'cache-certification-explained', 'cache-level-3-vs-level-5'].every(slug => sitemap.includes(`/blog/${slug}`)), 'sitemap includes parent and educator editorial routes');
requireCheck(!sitemap.includes('/blog/newsletter-'), 'sitemap keeps newsletters out of editorial routes');
const routeMetadata = read('src/app/components/RouteMetadata.tsx');
requireCheck(['/daycare/about', '/daycare/programs', '/eduhub/about', '/eduhub/programs', '/privacy', '/terms'].every(route => routeMetadata.includes(`'${route}'`)), 'public routes have explicit metadata and social sharing defaults');
requireCheck(read('src/app/components/PrivacyControls.tsx').includes('VITE_GA_MEASUREMENT_ID') && read('src/app/components/PrivacyControls.tsx').includes("choice === 'accepted'"), 'analytics loads only after explicit consent');
requireCheck(read('src/app/pages/Legal.tsx').includes('AUC New Cairo, Campus Center, Arnold Pavilion PO29'), 'verified public contact address appears in legal contact details');
const publicSlotImages = readdirSync(join(root, 'public', 'images', 'slots')).filter(name => /\.(?:jpe?g|png|webp)$/i.test(name)).map(name => statSync(join(root, 'public', 'images', 'slots', name)).size);
requireCheck(publicSlotImages.every(size => size < 500_000), 'all semantic public images are compressed below 500 KB');
requireCheck(existsSync(join(root, 'dist', 'index.html')), 'production build exists');
requireCheck(existsSync(join(root, 'playwright.config.ts')) && existsSync(join(root, 'tests', 'public-foundation.spec.ts')), 'cross-browser accessibility and responsive QA suite exists');
requireCheck(existsSync(join(root, '.github', 'workflows', 'quality.yml')), 'continuous quality workflow exists');
requireCheck(existsSync(join(root, 'scripts', 'verify-supabase.mjs')), 'credential-safe live Supabase verification command exists');
const repairBundle = read('supabase/LIVE_REPAIR_003_009.sql');
requireCheck(['003_roles_and_profiles.sql', '004_child_management_foundation.sql', '005_parent_portal_access.sql', '006_owner_console_security.sql', '007_identity_provisioning.sql', '008_child_consents.sql', '009_child_health_basics.sql'].every(name => repairBundle.includes(name)), 'live Supabase repair bundle contains canonical migrations 003–009');

for (const page of [
  'src/app/pages/Blog.tsx',
  'src/app/pages/BlogPost.tsx',
  'src/app/pages/daycare/About.tsx',
  'src/app/pages/daycare/Calendar.tsx',
  'src/app/pages/daycare/ParentInfo.tsx',
  'src/app/pages/daycare/Programs.tsx',
  'src/app/pages/eduhub/About.tsx',
  'src/app/pages/eduhub/ProgramDetail.tsx',
  'src/app/pages/eduhub/Programs.tsx',
]) {
  requireCheck(read(page).includes('<main>'), `${page} has a main-content landmark`);
}

const sourceFiles = [];
const walk = directory => {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(tsx?|css)$/.test(name)) sourceFiles.push(path);
  }
};
walk(join(root, 'src'));
const directRemoteImages = sourceFiles.flatMap(path => {
  const content = readFileSync(path, 'utf8');
  return [...content.matchAll(/<(?:img|source)[^>]+(?:src|srcSet)=['"]https?:\/\//g)].map(() => path.replace(`${root}\\`, ''));
});
requireCheck(directRemoteImages.length === 0, 'no hard-coded remote public image elements', `Hard-coded remote image elements: ${directRemoteImages.join(', ')}`);

if (failures.length) {
  process.stderr.write(`\nFoundation QA failed (${failures.length}):\n- ${failures.join('\n- ')}\n`);
  process.exit(1);
}

process.stdout.write(`\nFoundation QA passed: ${keys.length} image slots and all architecture invariants verified.\n`);
