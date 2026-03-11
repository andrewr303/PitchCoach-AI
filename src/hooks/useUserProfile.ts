import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  displayName: string;
  companyName: string;
  role: string;
  bio: string;
  customInstructions: string;
}

const EMPTY_PROFILE: UserProfile = {
  displayName: '',
  companyName: '',
  role: '',
  bio: '',
  customInstructions: '',
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? '');
        const meta = user.user_metadata ?? {};
        setProfile({
          displayName: meta.display_name ?? '',
          companyName: meta.company_name ?? '',
          role: meta.role ?? '',
          bio: meta.bio ?? '',
          customInstructions: meta.custom_instructions ?? '',
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const saveProfile = useCallback(async (updated: UserProfile) => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: updated.displayName,
          company_name: updated.companyName,
          role: updated.role,
          bio: updated.bio,
          custom_instructions: updated.customInstructions,
        },
      });
      if (error) throw error;
      setProfile(updated);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to save' };
    } finally {
      setSaving(false);
    }
  }, []);

  return { profile, email, loading, saving, saveProfile };
}
