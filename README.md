
# Early Years

The public Daycare and EduHub website, separate shared-password Parent Portal,
and private Owner/Admin/Teacher/Parent workspace foundation.

## Run locally

1. Run `npm install`.
2. Run `npm run dev`.

Public website imagery is bundled under `public/images/slots`. Replacing the
file for a semantic slot updates its uses without requiring Supabase. Dynamic
profiles such as educators, testimonials, and alumni may provide a remote image
and always retain a local slot fallback.

## Connect Supabase

Copy `.env.example` to `.env.local`, then add the current project's public
browser values:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Never add a service-role key to this website. After applying the migrations in
`supabase/migrations`, run `npm run backend:verify`. The command checks Auth,
all required tables, and the separate Parent Portal RPC without printing
credentials or record contents.

For an existing project that has only the original CMS tables, run
`npm run backend:prepare-repair`, then paste the generated
`supabase/LIVE_REPAIR_003_009.sql` into the Supabase SQL Editor and run it once.
Run `npm run backend:verify` again afterward; every line must pass before launch.

## Quality gate

Run `npm run qa:all` for the production build, architecture checks, mobile
Chrome, mobile Safari/WebKit, desktop Chrome, accessibility, responsive layout,
local-image resilience, and production dependency audit.
