import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentAdmin,
  logoutAdmin,
} from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD CURRENT ADMIN
  // ==========================================

  const loadAdmin = async () => {
    const token = localStorage.getItem("token");

    // No token = not authenticated
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getCurrentAdmin();

      if (data?.admin) {
        setAdmin(data.admin);

        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin)
        );
      } else {
        logoutAdmin();
        setAdmin(null);
      }
    } catch (error) {
      console.error(
        "Authentication check failed:",
        error
      );

      logoutAdmin();
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL AUTH CHECK
  // ==========================================

  useEffect(() => {
    loadAdmin();
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (token, adminData = null) => {
    localStorage.setItem("token", token);

    // If admin data is provided directly
    if (adminData) {
      setAdmin(adminData);

      localStorage.setItem(
        "admin",
        JSON.stringify(adminData)
      );

      return;
    }

    // Otherwise get admin from backend
    try {
      const data = await getCurrentAdmin();

      if (data?.admin) {
        setAdmin(data.admin);

        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load admin after login:",
        error
      );

      logoutAdmin();
      setAdmin(null);

      throw error;
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    logoutAdmin();
    setAdmin(null);
  };

  // ==========================================
  // AUTH CONTEXT
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: !!admin,
        login,
        logout,
        loadAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// CUSTOM AUTH HOOK
// ==========================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}