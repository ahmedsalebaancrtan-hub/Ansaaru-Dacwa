import { createContext } from "react";

import type {
  AuthSession,
  AuthUser,
} from "../types/Auth/auth.types";

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;

  saveSession: (
    session: AuthSession,
    remember: boolean,
  ) => void;

  logout: () => void;
}

// Context-ka waxaa lagu hayaa file aan component lahayn.
export const AuthContext =
  createContext<AuthContextValue | undefined>(undefined);