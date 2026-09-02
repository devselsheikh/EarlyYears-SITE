import type { SupabaseClient } from '@supabase/supabase-js';

export type DirectoryProfile = { id: string; displayName: string; role: 'owner' | 'admin' | 'teacher' | 'parent'; active: boolean };
export type ManagedChild = { id: string; name: string; classroomId: string; guardianIds: string[] };
export type ManagedClassroom = { id: string; name: string; ageGroup: string; capacity: number | null; teacherIds: string[]; childIds: string[] };
export type ClassManagementData = { classrooms: ManagedClassroom[]; profiles: DirectoryProfile[]; children: ManagedChild[] };

export const previewClassManagement: ClassManagementData = {
  profiles: [],
  children: [],
  classrooms: [],
};

function requireNoError(error: { message?: string } | null, fallback: string) {
  if (error) throw new Error(error.message || fallback);
}

export async function loadClassManagement(client: SupabaseClient): Promise<ClassManagementData> {
  const [classrooms, assignments, memberships, children, guardians, profiles] = await Promise.all([
    client.from('classrooms').select('id, name, age_group, capacity').eq('active', true).order('name'),
    client.from('staff_classroom_assignments').select('classroom_id, staff_id'),
    client.from('classroom_memberships').select('classroom_id, child_id').is('ends_on', null),
    client.from('children').select('id, display_name').eq('active', true).order('display_name'),
    client.from('child_guardians').select('child_id, guardian_id'),
    client.from('profiles').select('id, display_name, role, active').eq('active', true).order('display_name'),
  ]);
  for (const result of [classrooms, assignments, memberships, children, guardians, profiles]) requireNoError(result.error, 'Class setup could not be loaded.');
  const membershipRows = memberships.data ?? [];
  const guardianRows = guardians.data ?? [];
  return {
    profiles: (profiles.data ?? []).map(profile => ({ id: profile.id, displayName: profile.display_name || 'Unnamed account', role: profile.role, active: profile.active })) as DirectoryProfile[],
    children: (children.data ?? []).map(child => ({
      id: child.id,
      name: child.display_name,
      classroomId: membershipRows.find(row => row.child_id === child.id)?.classroom_id || '',
      guardianIds: guardianRows.filter(row => row.child_id === child.id).map(row => row.guardian_id),
    })),
    classrooms: (classrooms.data ?? []).map(classroom => ({
      id: classroom.id,
      name: classroom.name,
      ageGroup: classroom.age_group,
      capacity: classroom.capacity,
      teacherIds: (assignments.data ?? []).filter(row => row.classroom_id === classroom.id).map(row => row.staff_id),
      childIds: membershipRows.filter(row => row.classroom_id === classroom.id).map(row => row.child_id),
    })),
  };
}

export async function createCloudClassroom(client: SupabaseClient, name: string, ageGroup: string, capacity: number | null) {
  const { error } = await client.rpc('create_classroom', { classroom_name: name, classroom_age_group: ageGroup, classroom_capacity: capacity });
  requireNoError(error, 'The classroom was not created.');
}
export async function setCloudClassroomStaff(client: SupabaseClient, classroomId: string, staffId: string, assigned: boolean) {
  const { error } = await client.rpc('set_classroom_staff', { target_classroom: classroomId, target_staff: staffId, assigned });
  requireNoError(error, 'The educator assignment was not changed.');
}
export async function enrolCloudChild(client: SupabaseClient, childId: string, classroomId: string) {
  const { error } = await client.rpc('enrol_child_in_classroom', { target_child: childId, target_classroom: classroomId });
  requireNoError(error, 'The child was not moved.');
}
export async function linkCloudGuardian(client: SupabaseClient, childId: string, guardianId: string, relationship: string) {
  const { error } = await client.rpc('link_child_guardian', { target_child: childId, target_guardian: guardianId, guardian_relationship: relationship });
  requireNoError(error, 'The parent link was not saved.');
}
export async function createCloudChild(client: SupabaseClient, name: string, dateOfBirth: string, classroomId: string) {
  const { error } = await client.rpc('create_child_record', { child_name: name, child_date_of_birth: dateOfBirth || null, target_classroom: classroomId || null });
  requireNoError(error, 'The child record was not created.');
}
