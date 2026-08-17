"use client";

import type { Tenant, User } from "@zii/types";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "../../../lib/cookies";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "cashier" | "superadmin" | string;
  permissions?: string[];
}

export interface AuthTenant {
  id: string;
  name: string;
  subdomain?: string | null;
  status?: "trial" | "active" | "expired" | "suspended" | string;
  logoUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  receiptFooter?: string | null;
}

export interface RegisterInput {
  tenantName: string;
  subdomain?: string;
  planId?: string;
  ownerName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  tenant: AuthTenant | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tenant, setTenant] = useState<AuthTenant | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth State from Cookies and LocalStorage on mount
  useEffect(() => {
    try {
      const storedToken = getCookie("zii_auth_token");
      const storedUser = localStorage.getItem("zii_user");
      const storedTenant = localStorage.getItem("zii_tenant");

      if (storedToken && storedUser && storedTenant) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setTenant(JSON.parse(storedTenant));
      } else {
        // Clear if incomplete
        deleteCookie("zii_auth_token");
        deleteCookie("zii_tenant_id");
        deleteCookie("zii_tenant_status");
        deleteCookie("zii_tenant_subdomain");
        localStorage.removeItem("zii_user");
        localStorage.removeItem("zii_tenant");
      }
    } catch (error) {
      console.error("Failed to rehydrate auth state:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json();

      if (!res.ok || !body.success) {
        throw new Error(body.message || "Email atau password tidak valid.");
      }

      const {
        token: jwtToken,
        user: loggedUser,
        tenant: loggedTenant,
      } = body.data;

      // Save credentials & tenant status to Cookies (accessible by Edge Middleware)
      setCookie("zii_auth_token", jwtToken, 7);
      setCookie("zii_tenant_id", loggedTenant.id, 7);
      setCookie("zii_tenant_status", loggedTenant.status || "trial", 7);
      setCookie("zii_has_registered", "true", 365);

      const tenantSubdomain =
        loggedTenant.subdomain ||
        (typeof window !== "undefined"
          ? window.location.hostname
              .replace(".localhost", "")
              .replace(".ziipos.com", "")
          : "");
      if (tenantSubdomain && tenantSubdomain !== "localhost") {
        setCookie("zii_tenant_subdomain", tenantSubdomain, 7);
      }

      // Save profiles to LocalStorage (for fast Client UI rendering on reload)
      localStorage.setItem("zii_user", JSON.stringify(loggedUser));
      localStorage.setItem("zii_tenant", JSON.stringify(loggedTenant));

      // Update State
      setToken(jwtToken);
      setUser(loggedUser);
      setTenant(loggedTenant);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (input: RegisterInput) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register-tenant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const body = await res.json();

      if (!res.ok || !body.success) {
        throw new Error(body.message || "Gagal mendaftarkan merchant.");
      }

      const {
        token: jwtToken,
        user: registeredUser,
        tenant: registeredTenant,
      } = body.data;

      // Save credentials & tenant status to Cookies
      setCookie("zii_auth_token", jwtToken, 7);
      setCookie("zii_tenant_id", registeredTenant.id, 7);
      setCookie("zii_tenant_status", registeredTenant.status || "trial", 7);
      setCookie("zii_has_registered", "true", 365);

      const registeredSubdomain =
        registeredTenant.subdomain ||
        (typeof window !== "undefined"
          ? window.location.hostname
              .replace(".localhost", "")
              .replace(".ziipos.com", "")
          : "");
      if (registeredSubdomain && registeredSubdomain !== "localhost") {
        setCookie("zii_tenant_subdomain", registeredSubdomain, 7);
      }

      // Save profiles to LocalStorage
      localStorage.setItem("zii_user", JSON.stringify(registeredUser));
      localStorage.setItem("zii_tenant", JSON.stringify(registeredTenant));

      // Update State
      setToken(jwtToken);
      setUser(registeredUser);
      setTenant(registeredTenant);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Delete Cookies
    deleteCookie("zii_auth_token");
    deleteCookie("zii_tenant_id");
    deleteCookie("zii_tenant_status");
    deleteCookie("zii_tenant_subdomain");

    // Clear LocalStorage
    localStorage.removeItem("zii_user");
    localStorage.removeItem("zii_tenant");

    // Clear React State
    setToken(null);
    setUser(null);
    setTenant(null);

    // Redirect to Login Page
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
