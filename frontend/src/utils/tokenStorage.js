const ADMIN_ACCESS_KEY = "admin_access_token";
const ADMIN_REFRESH_KEY = "admin_refresh_token";
const STUDENT_ACCESS_KEY = "student_access_token";
const STUDENT_PROFILE_KEY = "student_profile";

export function setAdminTokens(tokens) {
  if (!tokens?.access) return;
  localStorage.setItem(ADMIN_ACCESS_KEY, tokens.access);
  if (tokens.refresh) {
    localStorage.setItem(ADMIN_REFRESH_KEY, tokens.refresh);
  }
}

export function getAdminAccessToken() {
  return localStorage.getItem(ADMIN_ACCESS_KEY) || "";
}

export function setStudentSession(session) {
  if (session?.access) {
    localStorage.setItem(STUDENT_ACCESS_KEY, session.access);
  }
  if (session?.student) {
    localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(session.student));
  }
}

export function getStudentAccessToken() {
  return localStorage.getItem(STUDENT_ACCESS_KEY) || "";
}

export function getStudentProfile() {
  const raw = localStorage.getItem(STUDENT_PROFILE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearTokens() {
  localStorage.removeItem(ADMIN_ACCESS_KEY);
  localStorage.removeItem(ADMIN_REFRESH_KEY);
  localStorage.removeItem(STUDENT_ACCESS_KEY);
  localStorage.removeItem(STUDENT_PROFILE_KEY);
}
