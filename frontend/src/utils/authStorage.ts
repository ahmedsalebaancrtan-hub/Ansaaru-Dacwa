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
   * Tokens are kept in localStorage so they survive page refreshes.
   */
  saveSession(session: AuthSession, _remember = true): void {
    this.clearSession();

    localStorage.setItem(STORAGE_KEYS.accessToken, session.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, session.refreshToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(session.user));
  },

  updateSession(session: AuthSession): void {
    localStorage.setItem(STORAGE_KEYS.accessToken, session.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, session.refreshToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(session.user));
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
