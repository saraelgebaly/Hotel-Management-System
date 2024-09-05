import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}
function ProtectedRoute({ children }: ProtectedRouteProps) {

  if (
    localStorage.getItem("token") &&
    localStorage.getItem("userRole") === "admin"
  ) {
    return children;
  } else if (
    localStorage.getItem("token") &&
    localStorage.getItem("userRole") === "user"
  ) {
    return <Navigate to={"/"} />;
  } else {
    return <Navigate to={"/auth/login"} />;
  }
}

export default ProtectedRoute;
