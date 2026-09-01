"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { getBrowserClient } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  initial: string;
  role: "learner" | "admin";
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function deriveUserProfile(user: User | null): UserProfile | null {
  if (!user) return null;

  const metadata = user.user_metadata || {};
  const email = user.email || "";

  // Dynamic derivation of display name from Google metadata, custom signup metadata, or email prefix
  const displayName =
    metadata.full_name ||
    metadata.name ||
    metadata.displayName ||
    (email ? email.split("@")[0] : "Warrior");

  // Dynamic avatar URL from Google OAuth avatar, Supabase avatar, or custom picture
  const avatarUrl =
    metadata.avatar_url ||
    metadata.picture ||
    undefined;

  const initial = displayName.charAt(0).toUpperCase() || "W";

  const role =
    user.app_metadata?.role === "admin" ||
    user.app_metadata?.is_admin === true ||
    user.app_metadata?.claims_admin === true
      ? "admin"
      : "learner";

  return {
    id: user.id,
    email,
    displayName,
    avatarUrl,
    initial,
    role,
    created_at: user.created_at,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    const supabase = getBrowserClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setUser(null);
        setProfile(null);
        setSession(null);
      } else {
        setUser(data.user);
        setProfile(deriveUserProfile(data.user));
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const supabase = getBrowserClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Initial session & user check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        setProfile(deriveUserProfile(session.user));
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    // Real-time auth state listener to invalidate & switch profile immediately upon login / logout / switch account
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setUser(newSession.user);
        setProfile(deriveUserProfile(newSession.user));
      } else {
        // Immediate full state wipe on logout/auth transition
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const supabase = getBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      user: null,
      profile: null,
      session: null,
      isLoading: false,
      signOut: async () => {},
      refreshProfile: async () => {},
    };
  }
  return context;
}
