import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


function ProtectedRoute() {

  const {
    isAuthenticated,
    loading,
  } = useAuth();


  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="mt-3 text-sm text-slate-500">
            Checking authentication...
          </p>

        </div>

      </div>
    );

  }


  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  return <Outlet />;
}


export default ProtectedRoute;