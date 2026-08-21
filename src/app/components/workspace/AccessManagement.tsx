import { useEffect, useState } from 'react';
import { LoaderCircle, ShieldCheck, UserRoundCog } from 'lucide-react';
import { APP_ROLES, ROLE_LABELS, type AppRole } from '../../auth/roles';
import { supabase } from '../../utils/supabase/client';

type Profile = { id: string; role: AppRole; display_name: string; active: boolean };

export function AccessManagement({ role, currentUserId }: { role: 'owner' | 'admin'; currentUserId: string }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [changingId, setChangingId] = useState('');

  const load = async () => {
    setState('loading');
    const { data, error } = await supabase.from('profiles').select('id, role, display_name, active').order('display_name');
    if (error) { setMessage('People could not be loaded. Existing access remains unchanged.'); setState('error'); return; }
    setProfiles((data ?? []) as Profile[]); setState('ready');
  };
  useEffect(() => { void load(); }, []);

  const assignRole = async (profile: Profile, nextRole: AppRole) => {
    if (profile.role === nextRole) return;
    setChangingId(profile.id); setMessage('');
    const { error } = await supabase.rpc('assign_profile_role', { target_user: profile.id, next_role: nextRole });
    if (error) setMessage(error.message || 'That role could not be changed. No access was modified.');
    else {
      setProfiles(current => current.map(item => item.id === profile.id ? { ...item, role: nextRole } : item));
      setMessage(`${profile.display_name || 'Account'} is now ${ROLE_LABELS[nextRole]}. They may need to sign in again.`);
    }
    setChangingId('');
  };

  const allowedRoles = role === 'owner' ? APP_ROLES : (['teacher', 'parent'] as const);
  return <section className="workspace-panel workspace-access" aria-labelledby="access-title">
    <div className="workspace-panel__heading"><div><p className="platform-eyebrow">People & access</p><h2 id="access-title">Workspace roles</h2></div><UserRoundCog aria-hidden="true" /></div>
    <p className="workspace-access__intro">{role === 'owner' ? 'Assign Owner, Admin, Teacher, or Parent access. The final active Owner is protected.' : 'Assign Teacher or Parent access. Owner and Admin accounts are protected.'}</p>
    {message && <div className={`workspace-access__message ${state === 'error' ? 'is-error' : ''}`} role="status">{message}</div>}
    {state === 'loading' ? <div className="workspace-access__loading"><LoaderCircle className="workspace-spin" aria-hidden="true" /> Loading people…</div> :
      <div className="workspace-access__list">{profiles.map(profile => {
        const protectedAccount = role === 'admin' && (profile.role === 'owner' || profile.role === 'admin');
        const ownOwnerAccount = role === 'owner' && profile.id === currentUserId && profile.role === 'owner';
        return <article key={profile.id}><span className="workspace-avatar">{(profile.display_name || 'Account').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}</span><span><strong>{profile.display_name || 'Unnamed account'}</strong><small>{profile.active ? 'Active account' : 'Inactive account'}{profile.id === currentUserId ? ' · You' : ''}</small></span>{protectedAccount || ownOwnerAccount ? <span className="workspace-access__protected"><ShieldCheck aria-hidden="true" />{ROLE_LABELS[profile.role]}</span> : <label><span className="sr-only">Role for {profile.display_name || 'account'}</span><select value={profile.role} disabled={changingId === profile.id} onChange={event => void assignRole(profile, event.target.value as AppRole)}>{allowedRoles.map(item => <option key={item} value={item}>{ROLE_LABELS[item]}</option>)}</select></label>}</article>;
      })}{state === 'ready' && profiles.length === 0 && <p className="workspace-empty">No profiles are available yet.</p>}</div>}
    {state === 'error' && <button type="button" className="platform-button platform-button--quiet" onClick={() => void load()}>Try again</button>}
  </section>;
}
