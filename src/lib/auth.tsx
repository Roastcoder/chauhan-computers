import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/integrations/supabase/client";

type AppRole = "admin" | "telecaller" | "customer";

interface AuthUser {
  id: string;
  email: string;
  role: AppRole;
  full_name: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: AppRole | null;
  profile: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, role: AppRole, phone: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me")
      .then(u => setUser(u))
      .catch(() => localStorage.removeItem("auth_token"))
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user: u } = await api.post("/auth/login", { email, password });
      localStorage.setItem("auth_token", token);
      setUser(u);
      return { error: null };
    } catch (e: any) {
      return { error: { message: e.message } };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, _role: AppRole, phone: string) => {
    try {
      await api.post("/auth/signup", { email, password, full_name: fullName, phone });
      return { error: null };
    } catch (e: any) {
      return { error: { message: e.message } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role ?? null, profile: user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
