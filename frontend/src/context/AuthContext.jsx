import { createContext, useContext, useMemo, useState } from "react";

import { clearTokens, getAdminAccessToken, setAdminTokens } from "../utils/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [adminToken, setAdminToken] = useState(getAdminAccessToken());

  const value = useMemo(
    () => ({
      adminToken,
      isAdminAuthenticated: Boolean(adminToken),
      setAdminSession: (tokens) => {
        setAdminTokens(tokens);
        setAdminToken(tokens?.access || "");
      },
      clearSession: () => {
        clearTokens();
        setAdminToken("");
      },
    }),
    [adminToken]
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
