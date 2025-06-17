"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored && typeof stored === 'string' && stored.split('.').length === 3) {
      try {
        setToken(stored);
        const decoded: any = jwtDecode(stored);
        setUser(decoded);
      } catch (error) {
        console.error("Error decoding token from localStorage:", error);
        logout();
      }
    } else if (stored) {
        console.warn("Invalid token format in localStorage, clearing:", stored);
        logout();
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      setUser(decoded);

      const exp = decoded.exp * 1000;
      const now = Date.now();
      const timeout = exp - now;

      if (timeout <= 0) {
        console.log("Token expired, logging out.");
        logout();
      } else {
        const timer = setTimeout(logout, timeout);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Error decoding token during expiration check:", error);
      logout();
    }
  }, [token]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    Cookies.set("auth_token", token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });
    setToken(token);
    try {
        const decoded: any = jwtDecode(token);
        setUser(decoded);
        router.push("/dashboard");
    } catch (error) {
        console.error("Error decoding token after login:", error);
        logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    Cookies.remove("auth_token"); // <--- REMOVE THE COOKIE ON LOGOUT
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};