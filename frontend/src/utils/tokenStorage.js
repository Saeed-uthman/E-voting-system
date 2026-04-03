const ACCESS_KEY = "admin_access_token";
const REFRESH_KEY = "admin_refresh_token";

export function setAdminTokens(tokens) {
  if (!tokens?.access) return;
  localStorage.setItem(ACCESS_KEY, tokens.access);
  if (tokens.refresh) {
    localStorage.setItem(REFRESH_KEY, tokens.refresh);
  }
}

export function getAdminAccessToken() {
  return localStorage.getItem(ACCESS_KEY) || "";
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
