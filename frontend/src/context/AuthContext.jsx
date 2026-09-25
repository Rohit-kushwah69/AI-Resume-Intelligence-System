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

    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {

      const data = await getCurrentAdmin();

      setAdmin(data.admin);

      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

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

  const login = (token, adminData = null) => {

    localStorage.setItem(
      "token",
      token
    );

    if (adminData) {

      setAdmin(adminData);

      localStorage.setItem(
        "admin",
        JSON.stringify(adminData)
      );

    }

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {

    logoutAdmin();

    setAdmin(null);

  };


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