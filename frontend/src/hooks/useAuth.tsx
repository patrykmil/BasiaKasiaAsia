import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "./useSessionStorage";
import { login as apiLogin, logout as apiLogout } from "../services/auth";

type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (email: string, master_hash: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
  const [access_token_type, setAccessTokenType] = useSessionStorage("access_token_type", null);
  const [accessToken, setAccessToken] = useSessionStorage("token", null);
  const [refreshToken, setRefreshToken] = useSessionStorage("refreshToken", null);
  const [expires_in, setExpiresIn] = useSessionStorage("access_token_expires_in", null);
  const [refresh_token_expires_in, setRefreshTokenExpiresIn] = useSessionStorage("refresh_token_expires_in", null);
  const [role, setRole] = useSessionStorage("role", null);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const login = async (email: string, master_hash: string) => {
    try {
      console.log("Logging in with email:", email);
      console.log("Using master hash:", master_hash);
      const data = await apiLogin(email, master_hash);
      setRole(data.role);
      setAccessTokenType(data.access_token_type);
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setExpiresIn(data.access_token_expires_in);
      setRefreshTokenExpiresIn(data.refresh_token_expires_in);
      setIsAuthenticated(true)
      console.log("Login successful, received data:", role);
      if (data.role === "admin") {
        navigate("/admin");
        return;
      }
      navigate("/forum");
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      accessToken,
      access_token_type,
      refreshToken,
      refresh_token_expires_in,
      expires_in,
      role,
      login,
      logout,
      isAuthenticated,
    }),
    [accessToken, refreshToken, expires_in, refresh_token_expires_in, access_token_type, role, isAuthenticated]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}