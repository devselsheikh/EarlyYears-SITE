import type { SupabaseClient } from '@supabase/supabase-js';
import type { AppRole } from '../auth/roles';
import type { AttendanceState, DailyCareRecord, WorkspaceData } from './workspaceStore';

const today = () => new Date().toISOString().slice(0, 10);
const profileName = (relation: unknown, fallback: string) => {
  const value = Array.isArray(relation) ? relation[0] : relation;
  return value && typeof value === 'object' && 'display_name' in value ? String(value.display_name || fallback) : fallback;
};
const profileRole = (relation: unknown) => {
  const value = Array.isArray(relation) ? relation[0] : relation;
  return value && typeof value === 'object' && 'role' in value ? String(value.role) : '';
};
const ageLabel = (dateOfBirth?: string | null) => {
  if (!dateOfBirth) return 'Age not recorded';
  const born = new Date(`${dateOfBirth}T00:00:00`), now = new Date();
  let months = (now.getFullYear() - born.getFullYear()) * 12 + now.getMonth() - born.getMonth();
  if (now.getDate() < born.getDate()) months -= 1;
  return months < 0 ? 'Age not recorded' : `${Math.floor(months / 12)} years, ${months % 12} months`;
};

export async function loadCloudWorkspace(client: SupabaseClient, userId: string): Promise<WorkspaceData> {
  const [{ data: children, error: childError }, { data: updates, error: updateError }, { data: messages, error: messageError }, { data: consents, error: consentError }] = await Promise.all([
    client.from('children').select('id, display_name, date_of_birth, room_name, allergies, key_person:profiles!children_key_person_id_fkey(display_name), child_guardians(relationship, guardian:profiles!child_guardians_guardian_id_fkey(display_name)), attendance_records(state, arrival_at, attendance_date)').eq('active', true).eq('attendance_records.attendance_date', today()),
    client.from('family_updates').select('id, child_id, kind, body, created_at, author:profiles!family_updates_author_id_fkey(display_name)').order('created_at', { ascending: false }).limit(200),
    client.from('family_messages').select('id, child_id, sender_id, body, read_at, created_at, sender:profiles!family_messages_sender_id_fkey(role)').order('created_at', { ascending: true }).limit(200),
    client.from('child_consents').select('child_id, consent_key, granted').eq('guardian_id', userId),
  ]);
  const error = childError || updateError || messageError || consentError;
  if (error) throw new Error(error.message);
  const [{ data: memberships }, { data: dailyReports }] = await Promise.all([
    client.from('classroom_memberships').select('child_id, classroom_id, classroom:classrooms(name)').lte('starts_on', today()).or(`ends_on.is.null,ends_on.gte.${today()}`),
    client.from('child_daily_reports').select('id, child_id, report_date, breakfast, lunch, snack, meal_notes, water_refills, wet_changes, soiled_changes, diaper_request, care_notes, published_at, updated_at').eq('report_date', today()),
  ]);
  const membershipMap = new Map((memberships ?? []).map((item: any) => [String(item.child_id), item]));
  const consentMap: Record<string, Record<string, boolean>> = {};
  for (const item of consents ?? []) {
    const childId = String(item.child_id);
    consentMap[childId] ??= { photos: false, localTrips: false, emergencyCare: false };
    consentMap[childId][String(item.consent_key)] = Boolean(item.granted);
  }
  return {
    children: (children ?? []).map((child: any) => {
      const attendance = child.attendance_records?.[0];
      const membership: any = membershipMap.get(String(child.id));
      return { id: child.id, name: child.display_name, room: profileName(membership?.classroom, child.room_name || 'Room not assigned'), classroomId: membership?.classroom_id ? String(membership.classroom_id) : undefined, age: ageLabel(child.date_of_birth), keyPerson: profileName(child.key_person, 'Not assigned'), guardian: profileName(child.child_guardians?.[0]?.guardian, 'Not linked'), attendance: (attendance?.state || 'pending') as AttendanceState, arrival: attendance?.arrival_at ? new Date(attendance.arrival_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : undefined, allergies: Array.isArray(child.allergies) ? child.allergies.map(String) : [] };
    }),
    updates: (updates ?? []).map((item: any) => ({ id: item.id, childId: item.child_id, author: profileName(item.author, 'Early Years team'), body: item.body, createdAt: item.created_at, kind: item.kind })),
    messages: (messages ?? []).map((item: any) => ({ id: item.id, childId: item.child_id, sender: (profileRole(item.sender) === 'parent' ? 'family' : 'team') as 'family' | 'team', body: item.body, createdAt: item.created_at, read: Boolean(item.read_at) })),
    consents: consentMap,
    dailyReports: (dailyReports ?? []).map((item: any) => ({ id: item.id, childId: item.child_id, reportDate: item.report_date, breakfast: item.breakfast, lunch: item.lunch, snack: item.snack, mealNotes: item.meal_notes, waterRefills: item.water_refills, wetChanges: item.wet_changes, soiledChanges: item.soiled_changes, diaperRequest: item.diaper_request, careNotes: item.care_notes, publishedAt: item.published_at || undefined, updatedAt: item.updated_at })),
    savedAt: new Date().toISOString(),
  };
}

export async function saveCloudAttendance(client: SupabaseClient, userId: string, childId: string, state: AttendanceState) {
  const { error } = await client.from('attendance_records').upsert({ child_id: childId, attendance_date: today(), state, arrival_at: state === 'present' ? new Date().toISOString() : null, recorded_by: userId }, { onConflict: 'child_id,attendance_date' });
  if (error) throw new Error(error.message);
}
export async function saveCloudUpdate(client: SupabaseClient, userId: string, childId: string, body: string) {
  const { error } = await client.from('family_updates').insert({ child_id: childId, author_id: userId, kind: 'learning', body });
  if (error) throw new Error(error.message);
}
export async function saveCloudMessage(client: SupabaseClient, userId: string, childId: string, body: string) {
  const { error } = await client.from('family_messages').insert({ child_id: childId, sender_id: userId, body });
  if (error) throw new Error(error.message);
}
export async function saveCloudConsent(client: SupabaseClient, userId: string, childId: string, key: string, granted: boolean) {
  const { error } = await client.from('child_consents').upsert({ child_id: childId, guardian_id: userId, consent_key: key, granted, updated_at: new Date().toISOString() }, { onConflict: 'child_id,guardian_id,consent_key' });
  if (error) throw new Error(error.message);
}

export async function saveCloudDailyCare(client: SupabaseClient, userId: string, classroomId: string, report: DailyCareRecord, publish: boolean) {
  const payload: Record<string, unknown> = {
    child_id: report.childId, classroom_id: classroomId, report_date: report.reportDate,
    breakfast: report.breakfast, lunch: report.lunch, snack: report.snack, meal_notes: report.mealNotes.trim(),
    water_refills: report.waterRefills, wet_changes: report.wetChanges, soiled_changes: report.soiledChanges,
    diaper_request: report.diaperRequest, care_notes: report.careNotes.trim(), updated_by: userId,
  };
  if (publish) payload.published_at = new Date().toISOString();
  const { error } = await client.from('child_daily_reports').upsert(payload, { onConflict: 'child_id,report_date' });
  if (error) throw new Error(error.message);
}
