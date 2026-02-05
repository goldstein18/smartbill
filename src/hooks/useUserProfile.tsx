
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "./useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserBrandingProfile {
  id?: string;
  user_id: string;
  company_name: string;
  company_tagline?: string;
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  logo_url?: string;
  primary_color?: string;
  created_at?: string;
  updated_at?: string;
}

export const useUserProfile = () => {
  const { user } = useSupabaseAuth();
  const [profile, setProfile] = useState<UserBrandingProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_branding_profiles' as any)
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data as unknown as UserBrandingProfile);
      } else {
        // Create default profile
        const defaultProfile: UserBrandingProfile = {
          user_id: user.id,
          company_name: 'SmartBill',
          company_tagline: 'Professional Time Tracking Services',
          primary_color: '#2563eb'
        };
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserBrandingProfile>) => {
    if (!user) return false;

    setIsSaving(true);
    try {
      const profileData = {
        user_id: user.id,
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_branding_profiles' as any)
        .upsert(profileData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update branding profile');
        return false;
      }

      setProfile(data as unknown as UserBrandingProfile);
      toast.success('Branding profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update branding profile');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profile,
    isLoading,
    isSaving,
    updateProfile
  };
};
