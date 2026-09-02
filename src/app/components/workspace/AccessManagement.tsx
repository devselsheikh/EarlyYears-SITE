import { useEffect, useState } from 'react';
import { LoaderCircle, MailPlus, ShieldCheck, UserRoundCog } from 'lucide-react';
import { APP_ROLES, ROLE_LABELS, type AppRole } from '../../auth/roles';
import { supabase } from '../../utils/supabase/client';

type Profile = { id: string; role: AppRole; display_name: string; active: boolean };
type Invitation = { id: string; email: string; display_name: string; invited_role: AppRole; status: 'pending' | 'sent' | 'failed' | 'accepted'; created_at: string };

export function AccessManagement({ role, currentUserId }: { role: 'owner' | 'admin'; currentUserId: string }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [changingId, setChangingId] = useState('');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AppRole>('parent');
  const [inviting, setInviting] = useState(false);
  const [messageIsError, setMessageIsError] = useState(false);

  const load = async () => {
    setState('loading');
    const [peopleResult, invitationResult] = await Promise.all([
      supabase.from('profiles').select('id, role, display_name, active').order('display_name'),
      supabase.from('workspace_invitations').select('id, email, display_name, invited_role, status, created_at').order('created_at', { ascending: false }).limit(6),
    ]);
    if (peopleResult.error) { setMessage('People could not be loaded. Existing access remains unchanged.'); setState('error'); return; }
    setProfiles((peopleResult.data ?? []) as Profile[]);
    if (!invitationResult.error) setInvitations((invitationResult.data ?? []) as Invitation[]);
    setState('ready');
  };
  useEffect(() => { void load(); }, []);

  const assignRole = async (profile: Profile, nextRole: AppRole) => {
    if (profile.role === nextRole) return;
    setChangingId(profile.id); setMessage(''); setMessageIsError(false);
    const { error } = await supabase.rpc('assign_profile_role', { target_user: profile.id, next_role: nextRole });
    if (error) { setMessageIsError(true); setMessage(error.message || 'That role could not be changed. No access was modified.'); }
    else {
      setProfiles(current => current.map(item => item.id === profile.id ? { ...item, role: nextRole } : item));
      setMessage(`${profile.display_name || 'Account'} is now ${ROLE_LABELS[nextRole]}. They may need to sign in again.`);
    }
    setChangingId('');
  };

  const allowedRoles = role === 'owner' ? APP_ROLES : (['teacher', 'parent'] as const);
  const invitationRoles = role === 'owner' ? (['admin', 'teacher', 'parent'] as const) : (['teacher', 'parent'] as const);
  const sendInvitation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inviteName.trim().length < 2 || !inviteEmail.trim()) return;
    setInviting(true); setMessage(''); setMessageIsError(false);
    const { data, error } = await supabase.functions.invoke('invite-workspace-user', { body: { displayName: inviteName.trim(), email: inviteEmail.trim(), role: inviteRole } });
    if (error || !data?.ok) { setMessageIsError(true); setMessage(data?.error || 'The invitation was not sent. Nothing was changed; please retry.'); }
    else { setMessage(data.message || 'Invitation sent securely.'); setInviteName(''); setInviteEmail(''); await load(); }
    setInviting(false);
  };
  return <section className="workspace-panel workspace-access" aria-labelledby="access-title">
    <div className="workspace-panel__heading"><div><p className="platform-eyebrow">People & access</p><h2 id="access-title">Workspace roles</h2></div><UserRoundCog aria-hidden="true" /></div>
    <p className="workspace-access__intro">{role === 'owner' ? 'Assign Owner, Admin, Teacher, or Parent access. The final active Owner is protected.' : 'Assign Teacher or Parent access. Owner and Admin accounts are protected.'}</p>
    {message && <div className={`workspace-access__message ${state === 'error' || messageIsError ? 'is-error' : ''}`} role="status">{message}</div>}
    <form className="workspace-invite" onSubmit={sendInvitation}>
      <div className="workspace-invite__heading"><MailPlus aria-hidden="true" /><div><strong>Invite someone</strong><small>They receive a secure email link and choose their own password.</small></div></div>
      <label>Full name<input value={inviteName} onChange={event => setInviteName(event.target.value)} maxLength={100} autoComplete="name" required placeholder="e.g. Sarah Al-Masri" /></label>
      <label>Email<input type="email" value={inviteEmail} onChange={event => setInviteEmail(event.target.value)} maxLength={320} autoComplete="email" required placeholder="name@example.com" /></label>
      <label>Workspace role<select value={inviteRole} onChange={event => setInviteRole(event.target.value as AppRole)}>{invitationRoles.map(item => <option key={item} value={item}>{ROLE_LABELS[item]}</option>)}</select></label>
      <button className="platform-button" disabled={inviting || inviteName.trim().length < 2 || !inviteEmail.trim()}>{inviting ? <LoaderCircle className="workspace-spin" aria-hidden="true" /> : <MailPlus aria-hidden="true" />}{inviting ? 'Sending…' : 'Send invitation'}</button>
      <p>Invitations are issued by the protected server function. Administrator credentials never enter this browser.</p>
    </form>
    {invitations.length > 0 && <div className="workspace-invitations" aria-label="Recent invitations"><strong>Recent invitations</strong>{invitations.map(invitation => <article key={invitation.id}><span><b>{invitation.display_name}</b><small>{invitation.email} · {ROLE_LABELS[invitation.invited_role]}</small></span><i className={`is-${invitation.status}`}>{invitation.status}</i></article>)}</div>}
    {state === 'loading' ? <div className="workspace-access__loading"><LoaderCircle className="workspace-spin" aria-hidden="true" /> Loading people…</div> :
      <div className="workspace-access__list">{profiles.map(profile => {
        const protectedAccount = role === 'admin' && (profile.role === 'owner' || profile.role === 'admin');
        const ownOwnerAccount = role === 'owner' && profile.id === currentUserId && profile.role === 'owner';
        return <article key={profile.id}><span className="workspace-avatar">{(profile.display_name || 'Account').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}</span><span><strong>{profile.display_name || 'Unnamed account'}</strong><small>{profile.active ? 'Active account' : 'Inactive account'}{profile.id === currentUserId ? ' · You' : ''}</small></span>{protectedAccount || ownOwnerAccount ? <span className="workspace-access__protected"><ShieldCheck aria-hidden="true" />{ROLE_LABELS[profile.role]}</span> : <label><span className="sr-only">Role for {profile.display_name || 'account'}</span><select value={profile.role} disabled={changingId === profile.id} onChange={event => void assignRole(profile, event.target.value as AppRole)}>{allowedRoles.map(item => <option key={item} value={item}>{ROLE_LABELS[item]}</option>)}</select></label>}</article>;
      })}{state === 'ready' && profiles.length === 0 && <p className="workspace-empty">No profiles are available yet.</p>}</div>}
    {state === 'error' && <button type="button" className="platform-button platform-button--quiet" onClick={() => void load()}>Try again</button>}
  </section>;
}
