import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

import users from "../data/users";

type User = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "manager";
};

type StoredUser = User & {
  password: string;
};

type AuthContextType = {
  user: User | null;

  login: (
    email: string,
    password: string
  ) => Promise<User | null>;

  signup: (
    name: string,
    email: string,
    password: string,
    role: "customer" | "manager"
  ) => Promise<boolean>;

  logout: () => Promise<void>;
};

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

// Temporary users created during app runtime
const runtimeUsers: StoredUser[] = [];

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  // LOGIN
  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanEmail = email.trim().toLowerCase();

        const originalUser = users.find(
          (item) =>
            item.email.trim().toLowerCase() ===
              cleanEmail &&
            item.password === password
        );

        const newUser = runtimeUsers.find(
          (item) =>
            item.email.trim().toLowerCase() ===
              cleanEmail &&
            item.password === password
        );

        const foundUser = originalUser || newUser;

        if (!foundUser) {
          resolve(null);
          return;
        }

        const loggedInUser: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role as
            | "customer"
            | "manager",
        };

        setUser(loggedInUser);

        resolve(loggedInUser);
      }, 800);
    });
  };

  // SIGNUP
  const signup = async (
    name: string,
    email: string,
    password: string,
    role: "customer" | "manager"
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanEmail = email.trim().toLowerCase();

        const alreadyExists =
          users.some(
            (item) =>
              item.email.trim().toLowerCase() ===
              cleanEmail
          ) ||
          runtimeUsers.some(
            (item) =>
              item.email.trim().toLowerCase() ===
              cleanEmail
          );

        if (alreadyExists) {
          resolve(false);
          return;
        }

        const newUser: StoredUser = {
          id: Date.now().toString(),
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        };

        runtimeUsers.push(newUser);

        setUser({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        });

        resolve(true);
      }, 800);
    });
  };

  // LOGOUT
  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}