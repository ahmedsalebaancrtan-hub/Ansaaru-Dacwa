import type { AuthSession, AuthUser } from "../types/Auth/auth.types";

const STORAGE_KEYS = {
  accessToken: "ansaaru_access_token",
  refreshToken: "ansaaru_refresh_token",
  user: "ansaaru_authenticated_user",
};

function getStoredValue(key: string): string | null {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key);
}

export const authStorage = {
  /**
   * Saves the authenticated session.
   *
   * remember = true  -> localStorage
   * remember = false -> sessionStorage
   */
  saveSession(session: AuthSession, remember: boolean): void {
    this.clearSession();

    const storage = remember ? localStorage : sessionStorage;

    storage.setItem(STORAGE_KEYS.accessToken, session.accessToken);
    storage.setItem(STORAGE_KEYS.refreshToken, session.refreshToken);
    storage.setItem(STORAGE_KEYS.user, JSON.stringify(session.user));
  },

  getAccessToken(): string | null {
    return getStoredValue(STORAGE_KEYS.accessToken);
  },

  getRefreshToken(): string | null {
    return getStoredValue(STORAGE_KEYS.refreshToken);
  },

  getUser(): AuthUser | null {
    const storedUser = getStoredValue(STORAGE_KEYS.user);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      this.clearSession();
      return null;
    }
  },

  clearSession(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  },
};