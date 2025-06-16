import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    user: User | null;
    error: AuthError | null;
  }>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{
    user: User | null;
    error: AuthError | null;
  }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(
  undefined,
);

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error(
      "useSupabaseAuth must be used within a SupabaseAuthProvider",
    );
  }
  return context;
};

interface SupabaseAuthProviderProps {
  children: React.ReactNode;
}

export const SupabaseAuthProvider: React.FC<SupabaseAuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { user: data.user, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};
