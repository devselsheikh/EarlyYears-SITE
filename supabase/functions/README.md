# Workspace invitation function

Deploy `invite-workspace-user` with Supabase JWT verification enabled.

Required function secrets:

- `APP_URL=https://app.theearlyyearscompany.com`
- `ALLOWED_ORIGINS=https://app.theearlyyearscompany.com`

Supabase supplies `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` to hosted Edge Functions. Never add those values to
the frontend environment or commit them to Git.

Local development permits only `http://127.0.0.1:5173` and
`http://localhost:5173` in addition to configured origins.
