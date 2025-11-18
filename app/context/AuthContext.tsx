import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
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
  socket: Socket | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const SOCKET_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const applyAxiosAuthHeader = useCallback((token: string | null) => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, []);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    }
  }, []);

  const initializeSocket = useCallback(
    (token: string) => {
      if (!token) return;

      disconnectSocket();

      const newSocket = io(SOCKET_URL || API_BASE_URL, {
        transports: ["websocket"],
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      newSocket.on("connect_error", (error: Error) => {
        console.warn("Socket connect_error", error);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    },
    [disconnectSocket],
  );

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



  const login = useCallback(
    ({ accessToken, refreshToken, profile }: LoginPayload) => {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken ?? null);

      void SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      applyAxiosAuthHeader(accessToken);

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

      initializeSocket(accessToken);
    },
    [initializeSocket, applyAxiosAuthHeader],
  );

  const clearSession = useCallback(async () => {
    disconnectSocket();
    setAccessToken(null);
    setRefreshToken(null);
    setProfile(null);
    applyAxiosAuthHeader(null);
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  }, [disconnectSocket, applyAxiosAuthHeader]);

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
          applyAxiosAuthHeader(storedAccessToken);
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
  }, [fetchProfile, applyAxiosAuthHeader]);

  useEffect(() => {
    if (!accessToken) {
      setProfile(null);
      disconnectSocket();
      return;
    }

    fetchProfile(accessToken);
    initializeSocket(accessToken);
  }, [accessToken, fetchProfile, initializeSocket, disconnectSocket]);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      refreshToken,
      profile,
      isAuthenticated: Boolean(accessToken),
      isHydrating,
      login,
      logout,
      socket,
    }),
    [accessToken, refreshToken, profile, isHydrating, login, logout, socket]
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
