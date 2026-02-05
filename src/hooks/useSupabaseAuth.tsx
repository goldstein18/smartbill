
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface SupabaseProfile {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  onboarding_completed: boolean;
}

interface SupabaseAuthContextType {
  user: User | null;
  profile: SupabaseProfile | null;
  session: Session | null;
  isLoading: boolean;
  onboardingCompleted: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string) => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Supabase auth state change:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile when session changes
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setOnboardingCompleted(false);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial Supabase session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      console.log("Profile fetched:", data);
      setProfile(data);
      setOnboardingCompleted(data?.onboarding_completed || false);
      console.log("Onboarding completed status:", data?.onboarding_completed || false);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setIsLoading(true);
      console.log("Supabase signup attempt:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            full_name: displayName
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
      
      console.log("Supabase signup successful:", data.user?.email);
      toast.success("Account created successfully! Please check your email to confirm your account.");
    } catch (error: any) {
      console.error("Supabase signup error:", error);
      toast.error(error.message || "Failed to create account");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Supabase signin attempt:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log("Supabase signin successful:", data.user?.email);
      toast.success("Signed in successfully!");
    } catch (error: any) {
      console.error("Supabase signin error:", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("Google OAuth signin attempt");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
      
      console.log("Google OAuth initiated successfully");
    } catch (error: any) {
      console.error("Google OAuth error:", error);
      toast.error(error.message || "Failed to sign in with Google");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("Supabase signout attempt");
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      console.log("Supabase signout successful");
      toast.success("Signed out successfully");
    } catch (error: any) {
      console.error("Supabase signout error:", error);
      toast.error(error.message || "Failed to sign out");
    }
  };

  const updateProfile = async (displayName: string) => {
    try {
      if (!user) throw new Error("No user is signed in");
      
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });
      
      if (authError) throw authError;
      
      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: displayName, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Refresh profile data
      await fetchUserProfile(user.id);
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  };

  const value: SupabaseAuthContextType = {
    user,
    profile,
    session,
    isLoading,
    onboardingCompleted,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider");
  }
  return context;
};
