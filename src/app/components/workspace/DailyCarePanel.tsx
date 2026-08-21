import { useEffect, useState } from 'react';
import { Baby, CheckCircle2, Droplets, Minus, NotebookPen, Plus, Send, Utensils } from 'lucide-react';
import type { ChildRecord, DailyCareRecord, MealAmount } from '../../data/workspaceStore';

const mealOptions: { value: MealAmount; label: string }[] = [
  { value: 'not_offered', label: 'Not offered' }, { value: 'none', label: 'None' }, { value: 'some', label: 'Some' },
  { value: 'half', label: 'Half' }, { value: 'most', label: 'Most' }, { value: 'all', label: 'All' },
];
const today = () => new Date().toISOString().slice(0, 10);
const emptyReport = (childId: string): DailyCareRecord => ({ childId, reportDate: today(), breakfast: 'not_offered', lunch: 'not_offered', snack: 'not_offered', mealNotes: '', waterRefills: 0, wetChanges: 0, soiledChanges: 0, diaperRequest: false, careNotes: '', updatedAt: new Date().toISOString() });

function Counter({ label, value, disabled = false, onChange }: { label: string; value: number; disabled?: boolean; onChange: (next: number) => void }) {
  return <div className="daily-care-counter"><span>{label}</span><div><button type="button" disabled={disabled} aria-label={`Decrease ${label}`} onClick={() => onChange(Math.max(0, value - 1))}><Minus aria-hidden="true" /></button><strong aria-live="polite">{value}</strong><button type="button" disabled={disabled} aria-label={`Increase ${label}`} onClick={() => onChange(Math.min(20, value + 1))}><Plus aria-hidden="true" /></button></div></div>;
}

export function DailyCarePanel({ child, saved, readOnly = false, onSave }: { child: ChildRecord; saved?: DailyCareRecord; readOnly?: boolean; onSave: (report: DailyCareRecord, publish: boolean) => void }) {
  const [report, setReport] = useState<DailyCareRecord>(() => saved ?? emptyReport(child.id));
  useEffect(() => setReport(saved ?? emptyReport(child.id)), [child.id, saved]);
  const setMeal = (key: 'breakfast' | 'lunch' | 'snack', value: MealAmount) => setReport(current => ({ ...current, [key]: value }));

  if (readOnly && !saved) return <section className="daily-care-card daily-care-card--empty"><NotebookPen aria-hidden="true" /><div><h3>Today’s care report</h3><p>The classroom team has not published today’s report yet.</p></div></section>;

  return <section className="daily-care" aria-labelledby="daily-care-title">
    <div className="daily-care__heading"><div><p className="platform-eyebrow">Daily care</p><h3 id="daily-care-title">Today at a glance</h3><p>{saved?.publishedAt ? 'Published to family' : readOnly ? 'Family copy' : 'Private staff draft until published'}</p></div>{saved?.publishedAt ? <span className="daily-care__published"><CheckCircle2 aria-hidden="true" />Published</span> : <NotebookPen aria-hidden="true" />}</div>
    <div className="daily-care__section"><div className="daily-care__section-title"><Utensils aria-hidden="true" /><div><strong>Meals</strong><small>Record how much was eaten.</small></div></div>{(['breakfast', 'lunch', 'snack'] as const).map(meal => <label className="daily-care-meal" key={meal}><span>{meal}</span><select disabled={readOnly} value={report[meal]} onChange={event => setMeal(meal, event.target.value as MealAmount)}>{mealOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>)}<label className="daily-care-notes"><span>Meal notes</span><textarea disabled={readOnly} maxLength={2000} value={report.mealNotes} onChange={event => setReport(current => ({ ...current, mealNotes: event.target.value }))} placeholder="Anything the family should know about meals…" /></label></div>
    <div className="daily-care__section"><div className="daily-care__section-title"><Droplets aria-hidden="true" /><div><strong>Hydration & changes</strong><small>Quick counters, saved with the child’s daily record.</small></div></div><div className="daily-care-counters"><Counter label="Water refills" disabled={readOnly} value={report.waterRefills} onChange={value => setReport(current => ({ ...current, waterRefills: value }))} /><Counter label="Wet changes" disabled={readOnly} value={report.wetChanges} onChange={value => setReport(current => ({ ...current, wetChanges: value }))} /><Counter label="Soiled changes" disabled={readOnly} value={report.soiledChanges} onChange={value => setReport(current => ({ ...current, soiledChanges: value }))} /></div><label className="daily-care-request"><input type="checkbox" disabled={readOnly} checked={report.diaperRequest} onChange={event => setReport(current => ({ ...current, diaperRequest: event.target.checked }))} /><Baby aria-hidden="true" /><span><strong>Request more diapers</strong><small>Include this request in the family’s report.</small></span></label></div>
    <div className="daily-care__section"><label className="daily-care-notes"><span>Care notes</span><textarea disabled={readOnly} maxLength={4000} value={report.careNotes} onChange={event => setReport(current => ({ ...current, careNotes: event.target.value }))} placeholder="Mood, rest, comfort, or anything important from today…" /></label></div>
    {!readOnly && <div className="daily-care__actions">{!saved?.publishedAt && <button type="button" className="platform-button platform-button--quiet" onClick={() => onSave(report, false)}>Save draft</button>}<button type="button" className="platform-button" onClick={() => onSave(report, true)}><Send aria-hidden="true" />{saved?.publishedAt ? 'Update family' : 'Publish to family'}</button></div>}
  </section>;
}
