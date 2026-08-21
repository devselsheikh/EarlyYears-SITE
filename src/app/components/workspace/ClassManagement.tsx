import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Check, LoaderCircle, Plus, School, ShieldCheck, UsersRound } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';
import {
  createCloudClassroom,
  enrolCloudChild,
  linkCloudGuardian,
  loadClassManagement,
  previewClassManagement,
  setCloudClassroomStaff,
  type ClassManagementData,
} from '../../data/classManagement';

type Props = { cloud: boolean };

export function ClassManagement({ cloud }: Props) {
  const [data, setData] = useState<ClassManagementData>(() => structuredClone(previewClassManagement));
  const [selectedId, setSelectedId] = useState(data.classrooms[0]?.id || '');
  const [state, setState] = useState<'loading' | 'ready' | 'saving' | 'error'>(cloud ? 'loading' : 'ready');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [capacity, setCapacity] = useState('');
  const [childId, setChildId] = useState('');
  const [guardianChildId, setGuardianChildId] = useState('');
  const [guardianId, setGuardianId] = useState('');
  const [relationship, setRelationship] = useState('Parent');

  const load = async () => {
    if (!cloud) return;
    setState('loading');
    try {
      const next = await loadClassManagement(supabase);
      setData(next);
      setSelectedId(current => next.classrooms.some(room => room.id === current) ? current : next.classrooms[0]?.id || '');
      setState('ready');
    } catch {
      setMessage('Class setup could not be loaded. Existing assignments remain unchanged.');
      setState('error');
    }
  };
  useEffect(() => { void load(); }, [cloud]);

  const selected = data.classrooms.find(room => room.id === selectedId);
  const teachers = data.profiles.filter(profile => profile.role === 'teacher' || profile.role === 'admin' || profile.role === 'owner');
  const parents = data.profiles.filter(profile => profile.role === 'parent');
  const warnings = useMemo(() => data.classrooms.flatMap(room => [
    ...(room.teacherIds.length < 2 ? [`${room.name} has ${room.teacherIds.length === 0 ? 'no assigned educators' : 'only one assigned educator'}.`] : []),
    ...(room.capacity !== null && room.childIds.length >= room.capacity ? [`${room.name} is at capacity.`] : []),
  ]), [data.classrooms]);

  const run = async (action: () => Promise<void> | void, success: string) => {
    setState('saving'); setMessage('');
    try {
      await action();
      if (cloud) await load(); else setState('ready');
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Nothing was changed. Please retry.');
      setState('error');
    }
  };

  const createRoom = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (cleanName.length < 2) return;
    const parsedCapacity = capacity ? Number(capacity) : null;
    void run(async () => {
      if (cloud) await createCloudClassroom(supabase, cleanName, ageGroup.trim(), parsedCapacity);
      else {
        const id = `class-${crypto.randomUUID()}`;
        setData(current => ({ ...current, classrooms: [...current.classrooms, { id, name: cleanName, ageGroup: ageGroup.trim(), capacity: parsedCapacity, teacherIds: [], childIds: [] }] }));
        setSelectedId(id);
      }
      setName(''); setAgeGroup(''); setCapacity('');
    }, `${cleanName} classroom created.`);
  };

  const toggleTeacher = (staffId: string, assigned: boolean) => {
    if (!selected) return;
    void run(async () => {
      if (cloud) await setCloudClassroomStaff(supabase, selected.id, staffId, assigned);
      else setData(current => ({ ...current, classrooms: current.classrooms.map(room => room.id === selected.id ? { ...room, teacherIds: assigned ? [...room.teacherIds, staffId] : room.teacherIds.filter(id => id !== staffId) } : room) }));
    }, assigned ? 'Educator assigned.' : 'Educator removed.');
  };

  const enrolChild = () => {
    if (!selected || !childId) return;
    void run(async () => {
      if (cloud) await enrolCloudChild(supabase, childId, selected.id);
      else setData(current => ({
        ...current,
        children: current.children.map(child => child.id === childId ? { ...child, classroomId: selected.id } : child),
        classrooms: current.classrooms.map(room => ({ ...room, childIds: room.id === selected.id ? [...room.childIds.filter(id => id !== childId), childId] : room.childIds.filter(id => id !== childId) })),
      }));
      setChildId('');
    }, 'Child classroom updated. The previous placement remains in history.');
  };

  const linkGuardian = () => {
    if (!guardianChildId || !guardianId) return;
    void run(async () => {
      if (cloud) await linkCloudGuardian(supabase, guardianChildId, guardianId, relationship);
      else setData(current => ({ ...current, children: current.children.map(child => child.id === guardianChildId ? { ...child, guardianIds: [...new Set([...child.guardianIds, guardianId])] } : child) }));
      setGuardianId('');
    }, 'Parent linked securely to this child.');
  };

  return <section className="workspace-panel class-manager" aria-labelledby="class-manager-title">
    <div className="workspace-panel__heading"><div><p className="platform-eyebrow">Operations</p><h2 id="class-manager-title">Class setup</h2></div><School aria-hidden="true" /></div>
    <div className="class-manager__summary"><p>Create rooms, assign educators, place children, and connect existing Parent accounts. Every cloud change is permission-checked and audited.</p><span><ShieldCheck aria-hidden="true" /> Owner & Admin only</span></div>
    {message && <div className={`workspace-access__message ${state === 'error' ? 'is-error' : ''}`} role="status">{state !== 'error' && <Check aria-hidden="true" />}{message}</div>}
    {warnings.length > 0 && <div className="class-manager__warnings"><AlertTriangle aria-hidden="true" /><div><strong>Setup attention</strong>{warnings.map(item => <p key={item}>{item}</p>)}</div></div>}
    {state === 'loading' ? <div className="workspace-access__loading"><LoaderCircle className="workspace-spin" aria-hidden="true" /> Loading class setup…</div> : <div className="class-manager__body">
      <aside className="class-manager__rooms" aria-label="Classrooms">{data.classrooms.map(room => <button type="button" key={room.id} className={room.id === selectedId ? 'is-selected' : ''} onClick={() => setSelectedId(room.id)}><span><strong>{room.name}</strong><small>{room.ageGroup || 'Age group not set'}</small></span><i>{room.childIds.length}{room.capacity ? `/${room.capacity}` : ''}</i></button>)}{data.classrooms.length === 0 && <p className="workspace-empty">Create your first classroom to begin.</p>}</aside>
      <div className="class-manager__detail">
        {selected ? <>
          <div className="class-manager__title"><div><h3>{selected.name}</h3><p>{selected.childIds.length} children · {selected.teacherIds.length} educators</p></div><UsersRound aria-hidden="true" /></div>
          <fieldset disabled={state === 'saving'}><legend>Educators</legend><p className="class-manager__help">Two educators per class is the operating target.</p><div className="class-manager__checks">{teachers.map(teacher => <label key={teacher.id}><input type="checkbox" checked={selected.teacherIds.includes(teacher.id)} onChange={event => toggleTeacher(teacher.id, event.target.checked)} /><span><strong>{teacher.displayName}</strong><small>{teacher.role}</small></span></label>)}{teachers.length === 0 && <p className="workspace-empty">No active Teacher accounts are available.</p>}</div></fieldset>
          <div className="class-manager__form-row"><label>Place a child<select value={childId} onChange={event => setChildId(event.target.value)}><option value="">Select a child</option>{data.children.map(child => <option key={child.id} value={child.id}>{child.name}{child.classroomId && child.classroomId !== selected.id ? ' · move from another class' : ''}</option>)}</select></label><button type="button" className="platform-button" disabled={!childId || state === 'saving'} onClick={enrolChild}>Save placement</button></div>
        </> : <p className="workspace-empty">Select or create a classroom.</p>}
        <details className="class-manager__details"><summary>Create a classroom</summary><form onSubmit={createRoom}><label>Name<input value={name} onChange={event => setName(event.target.value)} maxLength={80} required placeholder="e.g. Butterflies" /></label><label>Age group<input value={ageGroup} onChange={event => setAgeGroup(event.target.value)} maxLength={80} placeholder="e.g. 2–3 years" /></label><label>Capacity<input type="number" min="1" max="100" value={capacity} onChange={event => setCapacity(event.target.value)} placeholder="Optional" /></label><button className="platform-button" disabled={state === 'saving' || name.trim().length < 2}><Plus aria-hidden="true" /> Create classroom</button></form></details>
        <details className="class-manager__details"><summary>Link a Parent account</summary><div className="class-manager__link-form"><label>Child<select value={guardianChildId} onChange={event => setGuardianChildId(event.target.value)}><option value="">Select a child</option>{data.children.map(child => <option key={child.id} value={child.id}>{child.name}</option>)}</select></label><label>Parent account<select value={guardianId} onChange={event => setGuardianId(event.target.value)}><option value="">Select a parent</option>{parents.map(parent => <option key={parent.id} value={parent.id}>{parent.displayName}</option>)}</select></label><label>Relationship<input value={relationship} onChange={event => setRelationship(event.target.value)} maxLength={40} /></label><button type="button" className="platform-button" disabled={!guardianChildId || !guardianId || state === 'saving'} onClick={linkGuardian}>Link parent</button><small>New login invitations will be added through a server-only flow; passwords are never created or exposed here.</small></div></details>
      </div>
    </div>}
    {state === 'error' && cloud && <button type="button" className="platform-button platform-button--quiet class-manager__retry" onClick={() => void load()}>Try loading again</button>}
  </section>;
}
