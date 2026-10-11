import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { request, setAuthToken } from "../api/client";

type User = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "manager";
};

type AuthContextType = {
  user: User | null;
  token: string | null;

  login: (email: string, password: string) => Promise<User | null>;

  signup: (
    name: string,
    email: string,
    password: string,
    role: "customer" | "manager"
  ) => Promise<boolean>;

  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "@auth_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Save session in state, in the API client and in AsyncStorage
  const saveSession = async (newToken: string, serverUser: any) => {
    const sessionUser: User = {
      id: serverUser.email,
      name: serverUser.name,
      email: serverUser.email,
      role: serverUser.role,
    };

    setAuthToken(newToken);
    setToken(newToken);
    setUser(sessionUser);

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: newToken, user: sessionUser })
    );

    return sessionUser;
  };

  // Keep the user logged in after the app is closed and opened again
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setAuthToken(parsed.token);
          setToken(parsed.token);
          setUser(parsed.user);
        }
      } catch (error) {
        console.log("Could not restore session", error);
      }
    };

    restoreSession();
  }, []);

  // LOGIN -> POST /api/auth/login
  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      const data = await request("/api/auth/login", {
        method: "POST",
        body: { email: email.trim(), password },
      });

      return await saveSession(data.token, data.user);
    } catch (error) {
      console.log("Login failed:", (error as Error).message);
      return null;
    }
  };

  // SIGNUP -> POST /api/auth/register
  // The server always creates a "customer"; the role sent from the app is ignored.
  const signup = async (
    name: string,
    email: string,
    password: string,
    role: "customer" | "manager"
  ): Promise<boolean> => {
    try {
      const data = await request("/api/auth/register", {
        method: "POST",
        body: { name: name.trim(), email: email.trim(), password },
      });

      await saveSession(data.token, data.user);
      return true;
    } catch (error) {
      console.log("Signup failed:", (error as Error).message);
      return false;
    }
  };

  // LOGOUT clears the state, the API client and AsyncStorage
  const logout = async () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}