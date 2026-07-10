import {
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import {
  AuthContext,
  type AuthContextValue,
} from "./AuthContext";

import { authStorage } from "../utils/authStorage";

import type {
  AuthSession,
  AuthUser,
} from "../types/Auth/auth.types";

export function AuthProvider({
  children,
}: PropsWithChildren) {
  // Restore the authenticated user when the page refreshes.
  const [user, setUser] = useState<AuthUser | null>(() =>
    authStorage.getUser(),
  );

  // Save the user and tokens after a successful login.
  const saveSession = useCallback(
    (session: AuthSession, remember: boolean) => {
      authStorage.saveSession(session, remember);
      setUser(session.user);
    },
    [],
  );

  // Remove all authentication information.
  const logout = useCallback(() => {
    authStorage.clearSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,

      isAuthenticated: Boolean(
        user && authStorage.getAccessToken(),
      ),

      saveSession,
      logout,
    }),
    [user, saveSession, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}