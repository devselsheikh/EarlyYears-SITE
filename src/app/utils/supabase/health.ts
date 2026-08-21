import { supabase, supabaseConfigured } from './client';

export type BackendState = 'local' | 'checking' | 'online' | 'degraded';

export interface BackendHealth {
  state: BackendState;
  message: string;
  checkedAt: string;
  readyServices: string[];
  failedServices: string[];
}

export function localBackendHealth(): BackendHealth {
  return {
    state: 'local',
    message: 'Local mode — public pages and local image slots are available. Cloud workflows are disabled.',
    checkedAt: new Date().toISOString(),
    readyServices: ['Local public content', 'Semantic image slots', 'Device-saved previews'],
    failedServices: [],
  };
}

export async function checkBackendHealth(): Promise<BackendHealth> {
  if (!supabaseConfigured) return localBackendHealth();

  try {
    const timeout = new Promise<never>((_, reject) => {
      window.setTimeout(() => reject(new Error('Health check timed out')), 5_000);
    });
    const probes = [
      ['Published website', 'cms_published'], ['CMS drafts', 'cms_drafts'], ['Site settings', 'site_settings'],
      ['Announcements', 'site_popups'], ['Form submissions', 'submissions'], ['Role profiles', 'profiles'],
      ['Children', 'children'], ['Guardian links', 'child_guardians'], ['Attendance', 'attendance_records'],
      ['Family updates', 'family_updates'], ['Family messages', 'family_messages'], ['Parent consents', 'child_consents'],
    ] as const;
    const tableRequests = probes.map(async ([label, table]) => {
      const result = await supabase.from(table).select('*', { head: true, count: 'exact' }).limit(1);
      return { label, error: result.error };
    });
    const portalRequest = supabase.rpc('verify_parent_portal_pin', { candidate_pin: '__readiness_probe_invalid__' }).then(result => ({ label: 'Shared Parent Portal', error: result.error }));
    const request = Promise.all([...tableRequests, portalRequest]);
    const results = await Promise.race([request, timeout]);
    const failedServices = results.filter(result => result.error).map(result => result.label);
    const readyServices = results.filter(result => !result.error).map(result => result.label);
    if (failedServices.length) return {
      state: 'degraded',
      message: `Cloud connected, but ${failedServices.length} required ${failedServices.length === 1 ? 'service needs' : 'services need'} attention: ${failedServices.join(', ')}. Unconfirmed writes remain blocked.`,
      checkedAt: new Date().toISOString(), readyServices, failedServices,
    };
    return { state: 'online', message: `Cloud ready — all ${readyServices.length} required content, access, and child-management services responded.`, checkedAt: new Date().toISOString(), readyServices, failedServices: [] };
  } catch (error) {
    return {
      state: 'degraded',
      message: `Cloud services need attention. Local content and device-saved workflows remain active. ${error instanceof Error ? error.message : String(error)}`,
      checkedAt: new Date().toISOString(),
      readyServices: [],
      failedServices: ['Supabase connection'],
    };
  }
}
