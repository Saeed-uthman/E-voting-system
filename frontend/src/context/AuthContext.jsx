import { createContext, useContext, useMemo, useState } from "react";

import {
  clearTokens,
  getAdminAccessToken,
  getStudentAccessToken,
  getStudentProfile,
  setAdminTokens,
  setStudentSession,
} from "../utils/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [adminToken, setAdminToken] = useState(getAdminAccessToken());
  const [studentToken, setStudentToken] = useState(getStudentAccessToken());
  const [student, setStudent] = useState(getStudentProfile());

  const value = useMemo(
    () => ({
      adminToken,
      studentToken,
      student,
      isAdminAuthenticated: Boolean(adminToken),
      isStudentAuthenticated: Boolean(studentToken && student),
      setAdminSession: (tokens) => {
        setAdminTokens(tokens);
        setAdminToken(tokens?.access || "");
      },
      setStudentAuth: (session) => {
        setStudentSession(session);
        setStudentToken(session?.access || "");
        setStudent(session?.student || null);
      },
      clearSession: () => {
        clearTokens();
        setAdminToken("");
        setStudentToken("");
        setStudent(null);
      },
    }),
    [adminToken, studentToken, student]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
