import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { Session } from '@supabase/supabase-js';
import { ArrowRight, Check, CloudOff, Database, Eye, EyeOff, Heart, Home, LockKeyhole, LogOut, MessageCircle, School, Send, Settings2, ShieldCheck, Sparkles, UserPlus, UserRoundCog, UsersRound } from 'lucide-react';
import { APP_ROLES, ROLE_LABELS, type AppRole } from '../auth/roles';
import { useProfileRole } from '../auth/useProfileRole';
import { useWorkspaceStore, type AttendanceState } from '../data/workspaceStore';
import { supabase, supabaseConfigured } from '../utils/supabase/client';
import { checkBackendHealth, localBackendHealth, type BackendHealth } from '../utils/supabase/health';
import { AccessManagement } from '../components/workspace/AccessManagement';
import { DailyCarePanel } from '../components/workspace/DailyCarePanel';
import { ClassManagement } from '../components/workspace/ClassManagement';
import DaycareLogo from '../components/DaycareLogo';

const ROLE_COPY: Record<AppRole, { eyebrow: string; title: string; description: string }> = {
  owner: { eyebrow: 'Platform control', title: 'Owner workspace', description: 'Technical controls, system reliability, access, and full operational visibility.' },
  admin: { eyebrow: 'Day-to-day operations', title: 'Admin workspace', description: 'Children, families, attendance, communications, and team coordination.' },
  teacher: { eyebrow: 'Classroom tools', title: 'Teacher workspace', description: 'A focused view of assigned children, attendance, updates, and family messages.' },
  parent: { eyebrow: 'Future child management', title: 'Family account workspace', description: 'An individual child record foundation for future daily updates, messages, attendance, and permissions.' },
};

function WorkspaceGateShell({ children }: { children: ReactNode }) {
  return <main className="ey-gate">
    <header className="ey-gate__header">
      <Link to="/daycare" aria-label="Early Years Daycare home"><DaycareLogo /></Link>
      <Link to="/" className="ey-gate__back">Back to website <ArrowRight aria-hidden="true" /></Link>
    </header>
    <div className="ey-gate__layout">
      <section className="ey-gate__welcome" aria-labelledby="workspace-welcome-title">
        <div className="ey-gate__art" aria-hidden="true"><span>●</span><span>★</span><span>♥</span><Sparkles /></div>
        <div className="ey-gate__welcome-copy">
          <p className="platform-eyebrow">Early Years workspace</p>
          <h1 id="workspace-welcome-title">Everything for their day, in one caring place.</h1>
          <p>Simple, private tools that keep educators and families close to every important moment.</p>
        </div>
        <div className="ey-gate__trust"><ShieldCheck aria-hidden="true" /><span><strong>Private by design</strong><small>Access is limited to the children and classes assigned to each account.</small></span></div>
      </section>
      <section className="ey-gate__entry">{children}</section>
    </div>
  </main>;
}

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
  const [view, setView] = useState<'home' | 'children' | 'classes' | 'people'>('home');
  const selected = visibleChildren.find(child => child.id === selectedId) ?? visibleChildren[0];
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

  const childrenView = <div className="workspace-layout">
    <section className="workspace-panel" aria-labelledby="children-title"><div className="workspace-panel__heading"><div><p className="platform-eyebrow">Children</p><h2 id="children-title">{role === 'parent' ? 'My child' : role === 'teacher' ? 'My class' : 'Children & families'}</h2></div><UsersRound aria-hidden="true" /></div>{visibleChildren.length ? <div className="workspace-child-list">{visibleChildren.map(child => <button key={child.id} className={selected?.id === child.id ? 'is-selected' : ''} onClick={() => setSelectedId(child.id)}><span className="workspace-avatar">{child.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</span><span><strong>{child.name}</strong><small>{child.room} · {child.age}</small></span><i className={`attendance-dot attendance-dot--${child.attendance}`} aria-label={child.attendance} /></button>)}</div> : <div className="workspace-empty-state"><span><Heart aria-hidden="true" /></span><h3>{role === 'parent' ? 'No child is linked yet' : role === 'teacher' ? 'No children are assigned yet' : 'No children added yet'}</h3><p>{role === 'parent' ? 'An administrator will connect your account to your child.' : role === 'teacher' ? 'Children will appear here when an administrator assigns your class.' : 'Add your first child when you are ready. Nothing here is sample data.'}</p>{(role === 'owner' || role === 'admin') && <button className="platform-button" onClick={() => setView('classes')}>Start setup <ArrowRight aria-hidden="true" /></button>}</div>}</section>
    {selected && <section className="workspace-panel workspace-detail" aria-labelledby="detail-title"><div className="workspace-panel__heading"><div><p className="platform-eyebrow">Today</p><h2 id="detail-title">{selected.name}</h2></div><span>{selected.room}</span></div><dl className="workspace-facts"><div><dt>Key person</dt><dd>{selected.keyPerson || 'Not assigned'}</dd></div><div><dt>Guardian</dt><dd>{selected.guardian || 'Not linked'}</dd></div><div><dt>Allergies</dt><dd>{selected.allergies.join(', ') || 'None recorded'}</dd></div></dl><div className="workspace-field"><label>Attendance</label><AttendanceControl state={selected.attendance} disabled={role === 'parent'} onChange={state => updateAttendance(selected.id, state)} />{selected.arrival && <small>Arrived at {selected.arrival}</small>}</div><DailyCarePanel child={selected} saved={data.dailyReports.find(item => item.childId === selected.id && item.reportDate === new Date().toISOString().slice(0, 10))} readOnly={role === 'parent'} onSave={(report, publish) => saveDailyCare(selected.id, selected.classroomId || '', report, publish)} /><div className="workspace-feed"><h3>{role === 'parent' ? 'Daily updates' : 'Family timeline'}</h3>{data.updates.filter(update => update.childId === selected.id).map(update => <article key={update.id}><span className={`workspace-kind workspace-kind--${update.kind}`}>{update.kind}</span><p>{update.body}</p><small>{update.author} · {timeLabel(update.createdAt)}</small></article>)}{!data.updates.some(update => update.childId === selected.id) && <p className="workspace-empty">No updates yet today.</p>}</div><div className="workspace-feed"><h3>Messages</h3>{data.messages.filter(message => message.childId === selected.id).map(message => <article key={message.id}><span className="workspace-kind">{message.sender === 'family' ? 'Family' : 'Early Years'}</span><p>{message.body}</p><small>{timeLabel(message.createdAt)}</small></article>)}{!data.messages.some(message => message.childId === selected.id) && <p className="workspace-empty">No messages yet.</p>}</div><div className="workspace-composer"><label htmlFor="workspace-draft">{role === 'parent' ? 'Message the team' : 'Add a learning update'}</label><textarea id="workspace-draft" value={draft} onChange={event => setDraft(event.target.value)} maxLength={4000} placeholder={role === 'parent' ? 'Write a private message…' : 'Share a concise observation…'} /><button className="platform-button" onClick={submit} disabled={!draft.trim()}><Send aria-hidden="true" />{role === 'parent' ? 'Send message' : 'Publish update'}</button></div>{role !== 'parent' && <div className="workspace-composer"><label htmlFor="workspace-message-draft">Reply to family</label><textarea id="workspace-message-draft" value={messageDraft} onChange={event => setMessageDraft(event.target.value)} maxLength={4000} placeholder="Write a private reply…" /><button className="platform-button" onClick={submitTeamMessage} disabled={!messageDraft.trim()}><Send aria-hidden="true" />Send reply</button></div>}</section>}
  </div>;

  const navItems = role === 'owner' || role === 'admin' ? [{ id: 'home', label: 'Home', icon: Home }, { id: 'children', label: 'Children', icon: UsersRound }, { id: 'classes', label: 'Classes', icon: School }, { id: 'people', label: 'People', icon: UserRoundCog }] : [{ id: 'home', label: 'Home', icon: Home }, { id: 'children', label: role === 'parent' ? 'My child' : 'My class', icon: role === 'parent' ? Heart : UsersRound }];
  const openView = (id: string) => setView(id as typeof view);

  return <main className="ey-workspace">
    <aside className="ey-workspace__rail"><Link to="/daycare" className="ey-workspace__brand" aria-label="Early Years Daycare home"><DaycareLogo /></Link><nav aria-label="Workspace navigation">{navItems.map(item => <button key={item.id} className={view === item.id ? 'is-active' : ''} onClick={() => openView(item.id)}><item.icon aria-hidden="true" /><span>{item.label}</span></button>)}</nav><div className="ey-workspace__rail-foot"><span className={`platform-status platform-status--${health.state}`}>{health.state === 'online' ? <Database aria-hidden="true" /> : <CloudOff aria-hidden="true" />}{health.state === 'online' ? 'Securely connected' : localPreview ? 'Local preview' : 'Connection issue'}</span>{localPreview ? <button onClick={onChangeRole}><LogOut aria-hidden="true" /> Switch role</button> : <button onClick={() => void supabase.auth.signOut()}><LogOut aria-hidden="true" /> Sign out</button>}</div></aside>
    <div className="ey-workspace__main">
      <header className="ey-workspace__top"><div><p>{ROLE_LABELS[role]} workspace</p><strong>{view === 'home' ? 'Home' : navItems.find(item => item.id === view)?.label}</strong></div><span className="ey-workspace__role">{ROLE_LABELS[role]}</span></header>
      <div className="ey-workspace__content">
        {notice && <div className="workspace-toast" role="status"><Check aria-hidden="true" /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss notification">×</button></div>}
        {loading && <div className="workspace-loading" role="status">Loading your secure records…</div>}
        {view === 'home' && <><section className="ey-welcome"><div><p className="platform-eyebrow">{new Intl.DateTimeFormat([], { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p><h1>{role === 'parent' ? 'Your child’s day, all in one place.' : role === 'teacher' ? 'Everything you need for today.' : 'A simple view of your daycare.'}</h1><p>{role === 'parent' ? 'See published care notes, messages, and permissions securely.' : role === 'teacher' ? 'Attendance, care updates, and family messages—without the paperwork.' : 'Start with the next important task. Your workspace will fill naturally as your team uses it.'}</p></div><div className="ey-welcome__art" aria-hidden="true"><span>●</span><span>★</span><span>♥</span><Sparkles /></div></section><section className="workspace-stats" aria-label="Today at a glance"><article className="is-coral"><strong>{visibleChildren.length}</strong><span>{role === 'parent' ? 'Linked children' : 'Children'}</span></article><article className="is-mint"><strong>{visibleChildren.filter(child => child.attendance === 'present').length}</strong><span>Present today</span></article><article className="is-purple"><strong>{data.messages.filter(message => !message.read).length}</strong><span>New messages</span></article></section><section className="ey-actions"><div className="ey-section-heading"><div><p className="platform-eyebrow">Quick start</p><h2>What would you like to do?</h2></div></div><div>{(role === 'owner' || role === 'admin') && <><button onClick={() => setView('classes')}><span className="is-orange"><School /></span><strong>Set up a class</strong><small>Create rooms and assign educators</small><ArrowRight /></button><button onClick={() => setView('people')}><span className="is-purple"><UserPlus /></span><strong>Invite your team</strong><small>Add teachers and parent accounts</small><ArrowRight /></button></>}<button onClick={() => setView('children')}><span className="is-green"><UsersRound /></span><strong>{role === 'parent' ? 'View my child' : role === 'teacher' ? 'Open my class' : 'View children'}</strong><small>{role === 'parent' ? 'Care notes, updates, and permissions' : 'Attendance and daily care records'}</small><ArrowRight /></button>{role === 'parent' && <Link to="/daycare/parents"><span className="is-orange"><MessageCircle /></span><strong>General Parent Portal</strong><small>Menus, calendars, newsletters, and forms</small><ArrowRight /></Link>}</div></section>{role === 'owner' && <section className="workspace-owner-link"><Settings2 aria-hidden="true" /><div><strong>Website content and settings</strong><p>Manage website pages, images, enquiries, and system health in the Owner Console.</p></div><Link to="/admin" className="platform-button">Open Owner Console <ArrowRight aria-hidden="true" /></Link></section>}</>}
        {view === 'children' && <>{childrenView}{role === 'parent' && selected && <section className="workspace-panel workspace-consents"><div className="workspace-panel__heading"><div><p className="platform-eyebrow">Privacy</p><h2>Permissions</h2></div><ShieldCheck aria-hidden="true" /></div>{Object.entries({ photos: false, localTrips: false, emergencyCare: false, ...data.consents[selected.id] }).map(([key, enabled]) => <label key={key}><span><strong>{key === 'photos' ? 'Learning photos' : key === 'localTrips' ? 'Local walking trips' : 'Emergency care'}</strong><small>Update this preference at any time for {selected.name}.</small></span><input type="checkbox" checked={enabled} onChange={event => setConsent(selected.id, key, event.target.checked)} /></label>)}</section>}</>}
        {view === 'classes' && (role === 'owner' || role === 'admin') && <ClassManagement cloud={!localPreview} />}
        {view === 'people' && (role === 'owner' || role === 'admin') && (!localPreview && currentUserId ? <AccessManagement role={role} currentUserId={currentUserId} /> : <section className="workspace-panel workspace-empty-state"><span><UserRoundCog /></span><h2>People and invitations</h2><p>Connect Supabase and sign in as an Owner or Admin to invite real accounts. This preview never creates fake people.</p></section>)}
      </div>
    </div>
    <nav className="ey-workspace__mobile-nav" aria-label="Mobile workspace navigation">{navItems.map(item => <button key={item.id} className={view === item.id ? 'is-active' : ''} onClick={() => openView(item.id)}><item.icon aria-hidden="true" /><span>{item.label}</span></button>)}</nav>
  </main>;
}

export default function Workspace() {
  const [session, setSession] = useState<Session | null>(null), [sessionLoading, setSessionLoading] = useState(supabaseConfigured), [health, setHealth] = useState<BackendHealth>(() => localBackendHealth()), [previewRole, setPreviewRole] = useState<AppRole | null>(null), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [error, setError] = useState(''), [showPassword, setShowPassword] = useState(false), [signingIn, setSigningIn] = useState(false);
  const { role: authenticatedRole, loading: roleLoading, error: roleError, refresh: refreshRole } = useProfileRole(session);
  useEffect(() => { checkBackendHealth().then(setHealth); if (!supabaseConfigured) return; supabase.auth.getSession().then(({ data }) => setSession(data.session)).finally(() => setSessionLoading(false)); const { data } = supabase.auth.onAuthStateChange((_event, next) => { setSession(next); setSessionLoading(false); }); return () => data.subscription.unsubscribe(); }, []);
  const role = authenticatedRole ?? (!supabaseConfigured ? previewRole : null);
  if (sessionLoading || (session && roleLoading)) return <WorkspaceGateShell><div className="ey-gate__loading" role="status"><span aria-hidden="true" /><strong>Opening your workspace</strong><small>Verifying secure access…</small></div></WorkspaceGateShell>;
  if (role) return <RoleWorkspace role={role} health={health} localPreview={!supabaseConfigured} currentUserId={session?.user.id} onChangeRole={() => setPreviewRole(null)} />;
  if (session && roleError) return <WorkspaceGateShell><div className="ey-gate__entry-heading"><span className="ey-gate__icon"><LockKeyhole /></span><p className="platform-eyebrow">Secure account</p><h2>Access needs attention</h2><p>We couldn’t verify the workspace assigned to this account. No private records were opened.</p></div><p className="platform-error" role="alert">{roleError}</p><div className="platform-role-grid"><button onClick={() => void refreshRole()}><strong>Try again</strong><span>Recheck your secure profile</span><ArrowRight aria-hidden="true" /></button><button onClick={() => void supabase.auth.signOut()}><strong>Sign out</strong><span>Use a different account</span><ArrowRight aria-hidden="true" /></button></div></WorkspaceGateShell>;
  const signIn = async (event: React.FormEvent) => { event.preventDefault(); if (signingIn) return; setError(''); setSigningIn(true); const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password }); if (authError) setError('That email or password was not recognised. Check your details and try again.'); setSigningIn(false); };
  return <WorkspaceGateShell>
    <div className="ey-gate__entry-heading">
      <span className="ey-gate__icon"><LockKeyhole aria-hidden="true" /></span>
      <p className="platform-eyebrow">Private workspace</p>
      <h2>{supabaseConfigured ? 'Welcome back' : 'Choose a workspace'}</h2>
      <p>{supabaseConfigured ? 'Sign in with the account provided by Early Years.' : 'Explore each unpopulated workspace locally. Nothing here changes the live database.'}</p>
    </div>
    {supabaseConfigured ? <form onSubmit={signIn} className="ey-gate__form">
      <label htmlFor="workspace-email">Email address</label>
      <input id="workspace-email" type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" inputMode="email" placeholder="you@example.com" required />
      <label htmlFor="workspace-password">Password</label>
      <div className="ey-gate__password"><input id="workspace-password" type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" placeholder="Your password" required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></div>
      {error && <p className="platform-error" role="alert">{error}</p>}
      <button className="platform-button ey-gate__submit" type="submit" disabled={signingIn}>{signingIn ? 'Signing in…' : 'Sign in securely'} {!signingIn && <ArrowRight aria-hidden="true" />}</button>
    </form> : <div className="ey-gate__roles">{APP_ROLES.map((item, index) => <button key={item} className={`is-role-${index + 1}`} onClick={() => setPreviewRole(item)}><span className="ey-gate__role-icon">{item === 'parent' ? <Heart /> : item === 'teacher' ? <School /> : item === 'admin' ? <UsersRound /> : <Settings2 />}</span><span><strong>{ROLE_LABELS[item]}</strong><small>{ROLE_COPY[item].eyebrow}</small></span><ArrowRight aria-hidden="true" /></button>)}</div>}
    <div className="ey-gate__parent-link"><MessageCircle aria-hidden="true" /><span><strong>Looking for the general Parent Portal?</strong><small>Open calendars, menus, newsletters, and shared forms.</small></span><Link to="/daycare/parents">Open portal <ArrowRight aria-hidden="true" /></Link></div>
  </WorkspaceGateShell>;
}
