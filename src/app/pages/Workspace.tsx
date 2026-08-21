import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Session } from '@supabase/supabase-js';
import { ArrowRight, Check, CloudOff, Database, LockKeyhole, Send, Settings2, ShieldCheck, UsersRound } from 'lucide-react';
import { APP_ROLES, ROLE_LABELS, type AppRole } from '../auth/roles';
import { useProfileRole } from '../auth/useProfileRole';
import { useWorkspaceStore, type AttendanceState } from '../data/workspaceStore';
import { supabase, supabaseConfigured } from '../utils/supabase/client';
import { checkBackendHealth, localBackendHealth, type BackendHealth } from '../utils/supabase/health';
import { AccessManagement } from '../components/workspace/AccessManagement';
import { DailyCarePanel } from '../components/workspace/DailyCarePanel';
import { ClassManagement } from '../components/workspace/ClassManagement';

const ROLE_COPY: Record<AppRole, { eyebrow: string; title: string; description: string }> = {
  owner: { eyebrow: 'Platform control', title: 'Owner workspace', description: 'Technical controls, system reliability, access, and full operational visibility.' },
  admin: { eyebrow: 'Day-to-day operations', title: 'Admin workspace', description: 'Children, families, attendance, communications, and team coordination.' },
  teacher: { eyebrow: 'Classroom tools', title: 'Teacher workspace', description: 'A focused view of assigned children, attendance, updates, and family messages.' },
  parent: { eyebrow: 'Future child management', title: 'Family account workspace', description: 'An individual child record foundation for future daily updates, messages, attendance, and permissions.' },
};

function timeLabel(value: string) {
  return new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function AttendanceControl({ state, onChange, disabled = false }: { state: AttendanceState; onChange: (state: AttendanceState) => void; disabled?: boolean }) {
  return <div className="workspace-segmented" aria-label="Attendance status">{(['present', 'absent', 'pending'] as const).map(item => <button key={item} disabled={disabled} className={state === item ? 'is-active' : ''} onClick={() => onChange(item)}>{item}</button>)}</div>;
}

function RoleWorkspace({ role, health, localPreview, currentUserId, onChangeRole }: { role: AppRole; health: BackendHealth; localPreview: boolean; currentUserId?: string; onChangeRole: () => void }) {
  const { data: storedData, loading, notice, setNotice, updateAttendance, addUpdate, sendMessage, setConsent, saveDailyCare } = useWorkspaceStore({ cloud: !localPreview, userId: currentUserId });
  const data = role === 'parent' ? { ...storedData, dailyReports: storedData.dailyReports.filter(report => Boolean(report.publishedAt)) } : storedData;
  const visibleChildren = !localPreview ? data.children : role === 'parent' ? data.children.slice(0, 1) : role === 'teacher' ? data.children.filter(child => child.keyPerson === 'Sarah Al-Masri') : data.children;
  const [selectedId, setSelectedId] = useState(visibleChildren[0]?.id ?? '');
  const [draft, setDraft] = useState('');
  const [messageDraft, setMessageDraft] = useState('');
  const selected = visibleChildren.find(child => child.id === selectedId) ?? visibleChildren[0];
  const copy = ROLE_COPY[role];
  const submit = () => {
    if (!selected || !draft.trim()) return;
    if (role === 'parent') sendMessage(selected.id, draft, 'family'); else addUpdate(selected.id, draft);
    setDraft('');
  };
  const submitTeamMessage = () => {
    if (!selected || !messageDraft.trim()) return;
    sendMessage(selected.id, messageDraft, 'team');
    setMessageDraft('');
  };

  return <main className="platform-shell">
    <header className="platform-bar"><Link to="/" className="platform-brand" aria-label="Early Years home"><span className="platform-brand__mark">EY</span><span>Early Years</span></Link><div className="platform-bar__actions"><span className={`platform-status platform-status--${health.state}`}>{health.state === 'online' ? <Database aria-hidden="true" /> : <CloudOff aria-hidden="true" />}{health.state === 'online' ? 'Cloud online' : health.state === 'degraded' ? 'Cloud attention' : 'Local safe mode'}</span>{localPreview && <button className="platform-button platform-button--quiet" onClick={onChangeRole}>Switch role</button>}</div></header>
    <div className="platform-content">
      <section className="workspace-hero"><div><p className="platform-eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.description}</p></div><span className="platform-role-badge"><LockKeyhole aria-hidden="true" />{ROLE_LABELS[role]}</span></section>
      <div className={`platform-notice platform-notice--${health.state}`} role="status"><div><strong>{localPreview ? 'Local-first workspace' : 'System status'}</strong><p>{health.message}</p></div></div>
      {role === 'parent' && <aside className="workspace-portal-bridge"><div><strong>Looking for the general Parent Portal?</strong><p>The shared-password portal for newsletters, menus, calendars, and forms remains separate and does not require an individual child profile.</p></div><Link to="/daycare/parents" className="platform-button platform-button--quiet">Open Parent Portal <ArrowRight aria-hidden="true" /></Link></aside>}
      {notice && <div className="workspace-toast" role="status"><Check aria-hidden="true" /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss notification">×</button></div>}
      {loading && <div className="workspace-loading" role="status">Loading your secure records…</div>}
      <section className="workspace-stats" aria-label="Today at a glance"><article><strong>{visibleChildren.length}</strong><span>{role === 'parent' ? 'Child profile' : 'Children visible'}</span></article><article><strong>{visibleChildren.filter(child => child.attendance === 'present').length}</strong><span>Present today</span></article><article><strong>{data.messages.filter(message => !message.read).length}</strong><span>New messages</span></article></section>
      {(role === 'owner' || role === 'admin') && <ClassManagement cloud={!localPreview} />}
      {!localPreview && currentUserId && (role === 'owner' || role === 'admin') && <AccessManagement role={role} currentUserId={currentUserId} />}
      <div className="workspace-layout">
        <section className="workspace-panel" aria-labelledby="children-title"><div className="workspace-panel__heading"><div><p className="platform-eyebrow">Live records</p><h2 id="children-title">{role === 'parent' ? 'My child' : role === 'teacher' ? 'My classroom' : 'Children & families'}</h2></div><UsersRound aria-hidden="true" /></div><div className="workspace-child-list">{visibleChildren.map(child => <button key={child.id} className={selected?.id === child.id ? 'is-selected' : ''} onClick={() => setSelectedId(child.id)}><span className="workspace-avatar">{child.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</span><span><strong>{child.name}</strong><small>{child.room} · {child.age}</small></span><i className={`attendance-dot attendance-dot--${child.attendance}`} aria-label={child.attendance} /></button>)}</div></section>
        {selected && <section className="workspace-panel workspace-detail" aria-labelledby="detail-title"><div className="workspace-panel__heading"><div><p className="platform-eyebrow">Today</p><h2 id="detail-title">{selected.name}</h2></div><span>{selected.room}</span></div><dl className="workspace-facts"><div><dt>Key person</dt><dd>{selected.keyPerson}</dd></div><div><dt>Guardian</dt><dd>{selected.guardian}</dd></div><div><dt>Allergies</dt><dd>{selected.allergies.join(', ') || 'None recorded'}</dd></div></dl><div className="workspace-field"><label>Attendance</label><AttendanceControl state={selected.attendance} disabled={role === 'parent'} onChange={state => updateAttendance(selected.id, state)} />{selected.arrival && <small>Arrived at {selected.arrival}</small>}</div><DailyCarePanel child={selected} saved={data.dailyReports.find(item => item.childId === selected.id && item.reportDate === new Date().toISOString().slice(0, 10))} readOnly={role === 'parent'} onSave={(report, publish) => saveDailyCare(selected.id, selected.classroomId || '', report, publish)} /><div className="workspace-feed"><h3>{role === 'parent' ? 'Daily updates' : 'Recent family timeline'}</h3>{data.updates.filter(update => update.childId === selected.id).map(update => <article key={update.id}><span className={`workspace-kind workspace-kind--${update.kind}`}>{update.kind}</span><p>{update.body}</p><small>{update.author} · {timeLabel(update.createdAt)}</small></article>)}{!data.updates.some(update => update.childId === selected.id) && <p className="workspace-empty">No updates yet today.</p>}</div><div className="workspace-feed"><h3>Family messages</h3>{data.messages.filter(message => message.childId === selected.id).map(message => <article key={message.id}><span className="workspace-kind">{message.sender === 'family' ? 'Family' : 'Early Years'}</span><p>{message.body}</p><small>{timeLabel(message.createdAt)}</small></article>)}{!data.messages.some(message => message.childId === selected.id) && <p className="workspace-empty">No messages in this conversation yet.</p>}</div><div className="workspace-composer"><label htmlFor="workspace-draft">{role === 'parent' ? 'Message the team' : 'Add a learning update'}</label><textarea id="workspace-draft" value={draft} onChange={event => setDraft(event.target.value)} maxLength={4000} placeholder={role === 'parent' ? 'Write a private message…' : 'Share a concise observation…'} /><button className="platform-button" onClick={submit} disabled={!draft.trim()}><Send aria-hidden="true" />{role === 'parent' ? 'Send message' : 'Publish update'}</button></div>{role !== 'parent' && <div className="workspace-composer"><label htmlFor="workspace-message-draft">Reply to family</label><textarea id="workspace-message-draft" value={messageDraft} onChange={event => setMessageDraft(event.target.value)} maxLength={4000} placeholder="Write a private reply…" /><button className="platform-button" onClick={submitTeamMessage} disabled={!messageDraft.trim()}><Send aria-hidden="true" />Send family message</button></div>}</section>}
      </div>
      {role === 'parent' && selected && <section className="workspace-panel workspace-consents"><div className="workspace-panel__heading"><div><p className="platform-eyebrow">Privacy</p><h2>Permissions</h2></div><ShieldCheck aria-hidden="true" /></div>{Object.entries({ photos: false, localTrips: false, emergencyCare: false, ...data.consents[selected.id] }).map(([key, enabled]) => <label key={key}><span><strong>{key === 'photos' ? 'Learning photos' : key === 'localTrips' ? 'Local walking trips' : 'Emergency care'}</strong><small>Update this preference at any time for {selected.name}.</small></span><input type="checkbox" checked={enabled} onChange={event => setConsent(selected.id, key, event.target.checked)} /></label>)}</section>}
      {role === 'owner' && <section className="workspace-owner-link"><Settings2 aria-hidden="true" /><div><strong>Technical Owner Console</strong><p>Website publishing, image slots, configuration, audit, and system health remain owner-only.</p></div><Link to="/admin" className="platform-button">Open console <ArrowRight aria-hidden="true" /></Link></section>}
    </div>
  </main>;
}

export default function Workspace() {
  const [session, setSession] = useState<Session | null>(null), [sessionLoading, setSessionLoading] = useState(supabaseConfigured), [health, setHealth] = useState<BackendHealth>(() => localBackendHealth()), [previewRole, setPreviewRole] = useState<AppRole | null>(null), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [error, setError] = useState('');
  const { role: authenticatedRole, loading: roleLoading, error: roleError, refresh: refreshRole } = useProfileRole(session);
  useEffect(() => { checkBackendHealth().then(setHealth); if (!supabaseConfigured) return; supabase.auth.getSession().then(({ data }) => setSession(data.session)).finally(() => setSessionLoading(false)); const { data } = supabase.auth.onAuthStateChange((_event, next) => { setSession(next); setSessionLoading(false); }); return () => data.subscription.unsubscribe(); }, []);
  const role = authenticatedRole ?? (!supabaseConfigured ? previewRole : null);
  if (sessionLoading || (session && roleLoading)) return <main className="platform-gate"><div className="workspace-loading" role="status">Verifying your secure workspace…</div></main>;
  if (role) return <RoleWorkspace role={role} health={health} localPreview={!supabaseConfigured} currentUserId={session?.user.id} onChangeRole={() => setPreviewRole(null)} />;
  if (session && roleError) return <main className="platform-gate"><section className="platform-gate__card"><Link to="/" className="platform-brand"><span className="platform-brand__mark">EY</span><span>Early Years</span></Link><p className="platform-eyebrow">Private workspace</p><h1>Access needs attention</h1><p className="platform-error" role="alert">{roleError}</p><div className="platform-role-grid"><button onClick={() => void refreshRole()}><strong>Try again</strong><span>Recheck your secure profile</span><ArrowRight aria-hidden="true" /></button><button onClick={() => void supabase.auth.signOut()}><strong>Sign out</strong><span>Use a different account</span><ArrowRight aria-hidden="true" /></button></div></section></main>;
  const signIn = async (event: React.FormEvent) => { event.preventDefault(); setError(''); const { error: authError } = await supabase.auth.signInWithPassword({ email, password }); if (authError) setError(authError.message); };
  return <main className="platform-gate"><section className="platform-gate__card"><Link to="/" className="platform-brand"><span className="platform-brand__mark">EY</span><span>Early Years</span></Link><p className="platform-eyebrow">Private workspace</p><h1>{supabaseConfigured ? 'Welcome back' : 'Local role preview'}</h1><p>{supabaseConfigured ? 'Sign in to open the private workspace assigned to your account.' : 'Cloud credentials are not present, so the complete role workflows are available in local safe mode.'}</p>{supabaseConfigured ? <form onSubmit={signIn} className="platform-form"><label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label>{error && <p className="platform-error" role="alert">{error}</p>}<button className="platform-button" type="submit">Sign in <ArrowRight aria-hidden="true" /></button></form> : <div className="platform-role-grid">{APP_ROLES.map(item => <button key={item} onClick={() => setPreviewRole(item)}><strong>{ROLE_LABELS[item]}</strong><span>{ROLE_COPY[item].eyebrow}</span><ArrowRight aria-hidden="true" /></button>)}</div>}</section></main>;
}
