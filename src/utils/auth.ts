export type LoginAccount = {
  username: string;
  password: string;
};

const AUTH_KEY = 'kox-demo-auth';

export function getAuth(): LoginAccount | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LoginAccount;
  } catch {
    return null;
  }
}

export function saveAuth(account: LoginAccount) {
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(account));
}

export function clearAuth() {
  window.localStorage.removeItem(AUTH_KEY);
}

