import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { API_BASE_URL } from "../lib/router-api/api-router";

type LoginPayload = {
  accessToken: string;
  refreshToken?: string | null;
  profile?: unknown;
};

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  profile: unknown;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (payload: LoginPayload) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [isHydrating, setIsHydrating] = useState(true);


  const fetchProfile = useCallback(async (token?: string) => {
    const bearerToken = token ?? accessToken;
    if (!bearerToken) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      const userData = response.data?.data ?? response.data;
      setProfile(userData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }, [accessToken]);

  const login = useCallback(({ accessToken, refreshToken, profile }: LoginPayload) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken ?? null);

    void SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
      void SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      void SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }

    if (profile) {
      setProfile(profile);
    } else {
      setProfile(null);
    }
  }, []);

  const clearSession = useCallback(async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setProfile(null);
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedAccessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
        }

        if (storedRefreshToken) {
          setRefreshToken(storedRefreshToken || null);
        }

        if (storedAccessToken) {
          await fetchProfile(storedAccessToken);
        }
      } catch (error) {
        console.error("Failed to restore auth session:", error);
      } finally {
        setIsHydrating(false);
      }
    };

    restoreSession();
  }, [fetchProfile]);

  useEffect(() => {
    if (!accessToken) {
      setProfile(null);
      return;
    }

    fetchProfile(accessToken);
  }, [accessToken, fetchProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      refreshToken,
      profile,
      isAuthenticated: Boolean(accessToken),
      isHydrating,
      login,
      logout,
    }),
    [accessToken, refreshToken, profile, isHydrating, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
