import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isAppRole, type AppRole } from './roles';
import { supabase } from '../utils/supabase/client';

type RoleState = { role: AppRole | null; loading: boolean; error: string };

export function useProfileRole(session: Session | null) {
  const [state, setState] = useState<RoleState>({ role: null, loading: false, error: '' });

  const refresh = useCallback(async () => {
    if (!session) {
      setState({ role: null, loading: false, error: '' });
      return;
    }
    setState(current => ({ ...current, loading: true, error: '' }));
    const { data, error } = await supabase
      .from('profiles')
      .select('role, active')
      .eq('id', session.user.id)
      .maybeSingle();
    if (error) {
      setState({ role: null, loading: false, error: 'Your workspace role could not be verified. No private tools were opened.' });
      return;
    }
    if (!data || !data.active || !isAppRole(data.role)) {
      setState({ role: null, loading: false, error: data?.active === false ? 'This account is inactive. Contact the Owner for access.' : 'Your account profile is not ready yet. Contact the Owner for access.' });
      return;
    }
    setState({ role: data.role, loading: false, error: '' });
  }, [session?.user.id]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { ...state, refresh };
}
