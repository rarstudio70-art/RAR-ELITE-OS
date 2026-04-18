import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminActive } from "../admin";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  // Founder admin override — YOU ONLY
  if (isAdminActive()) {
    return children;
  }

  // Paid access gate — token set after purchase/auth
  const authToken = localStorage.getItem("rar_auth_token");

  if (!authToken || authToken.trim().length < 10) {
    return (
      <Navigate
        to="/access-denied"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}