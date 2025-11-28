import React from "react";
import { Navigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { isLoggedInAtom, isAdminAtom } from "../atoms/authAtoms";

/**
 * ProtectedRoute Component
 *
 * Protects routes based on authentication and role requirements
 *
 * @param {React.ReactNode} children - The component to render if authorized
 * @param {boolean} requireAdmin - Whether the route requires admin access
 * @param {string} redirectTo - Where to redirect if not authorized
 */
const ProtectedRoute = ({ children, requireAdmin = false, redirectTo = "/" }) => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const isAdmin = useAtomValue(isAdminAtom);

  // Not logged in at all
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but needs admin access
  if (requireAdmin && !isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }

  // Authorized, render children
  return children;
};

export default ProtectedRoute;
