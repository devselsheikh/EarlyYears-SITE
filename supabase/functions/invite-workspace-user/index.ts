import { createClient } from 'npm:@supabase/supabase-js@2.108.2';
import { corsHeaders, originAllowed } from '../_shared/cors.ts';

type InviteBody = { email?: unknown; displayName?: unknown; role?: unknown };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(origin: string | null, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

Deno.serve(async request => {
  const origin = request.headers.get('Origin');
  if (request.method === 'OPTIONS') return originAllowed(origin) ? new Response('ok', { headers: corsHeaders(origin) }) : json(origin, { error: 'Origin not allowed' }, 403);
  if (request.method !== 'POST') return json(origin, { error: 'Method not allowed' }, 405);
  if (!originAllowed(origin)) return json(origin, { error: 'Origin not allowed' }, 403);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const appUrl = (Deno.env.get('APP_URL') || '').replace(/\/$/, '');
  const authorization = request.headers.get('Authorization');
  if (!supabaseUrl || !anonKey || !serviceKey || !appUrl || !authorization) return json(origin, { error: 'Invitation service is not configured' }, 503);

  let body: InviteBody;
  try { body = await request.json(); } catch { return json(origin, { error: 'Invalid request' }, 400); }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : '';
  const role = typeof body.role === 'string' ? body.role : '';
  if (!emailPattern.test(email) || email.length > 320 || displayName.length < 2 || displayName.length > 100 || !['admin', 'teacher', 'parent'].includes(role)) {
    return json(origin, { error: 'Check the name, email, and role' }, 400);
  }

  const callerClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } }, auth: { persistSession: false } });
  const { data: userData, error: userError } = await callerClient.auth.getUser();
  if (userError || !userData.user) return json(origin, { error: 'Authentication required' }, 401);
  const { data: caller } = await callerClient.from('profiles').select('role, active').eq('id', userData.user.id).single();
  if (!caller?.active || !['owner', 'admin'].includes(caller.role)) return json(origin, { error: 'Owner or Admin access is required' }, 403);
  if (caller.role === 'admin' && role === 'admin') return json(origin, { error: 'Only an Owner can invite an Admin' }, 403);

  const service = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const windowStart = new Date(Date.now() - 15 * 60_000).toISOString();
  const { count } = await service.from('workspace_invitations').select('id', { count: 'exact', head: true }).eq('invited_by', userData.user.id).gte('created_at', windowStart);
  if ((count || 0) >= 10) return json(origin, { error: 'Invitation limit reached. Try again later.' }, 429);

  const { data: invitation, error: recordError } = await service.from('workspace_invitations').insert({ email, display_name: displayName, invited_role: role, invited_by: userData.user.id }).select('id').single();
  if (recordError || !invitation) return json(origin, { error: 'Invitation could not be prepared' }, 500);

  const { data: invited, error: inviteError } = await service.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${appUrl}/workspace`,
    data: { display_name: displayName },
  });
  if (inviteError || !invited.user) {
    await service.from('workspace_invitations').update({ status: 'failed', updated_at: new Date().toISOString() }).eq('id', invitation.id);
    await service.from('audit_log').insert({ actor_id: userData.user.id, action: 'workspace.invitation.failed', resource_type: 'workspace_invitations', resource_id: invitation.id });
    return json(origin, { error: 'Invitation could not be sent. Confirm the email and try again.' }, 400);
  }

  const { error: profileError } = await service.from('profiles').update({ display_name: displayName, role, active: true, updated_at: new Date().toISOString() }).eq('id', invited.user.id);
  if (profileError) {
    await service.from('workspace_invitations').update({ status: 'failed', provider_user_id: invited.user.id, updated_at: new Date().toISOString() }).eq('id', invitation.id);
    return json(origin, { error: 'The account was invited but its workspace role needs administrator attention.' }, 500);
  }

  await service.from('workspace_invitations').update({ status: 'sent', provider_user_id: invited.user.id, updated_at: new Date().toISOString() }).eq('id', invitation.id);
  await service.from('audit_log').insert({ actor_id: userData.user.id, action: 'workspace.invitation.sent', resource_type: 'workspace_invitations', resource_id: invitation.id, after_state: { invited_role: role, provider_user_id: invited.user.id } });
  return json(origin, { ok: true, message: `Invitation sent to ${email}` });
});
