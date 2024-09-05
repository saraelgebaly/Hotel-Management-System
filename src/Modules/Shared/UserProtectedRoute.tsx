import React from 'react';
import { Navigate } from 'react-router-dom';


interface IProps {
    children: React.ReactNode
  }
  
function UserProtectedRoute({children}: IProps) {
    if (
        localStorage.getItem("token") &&
        localStorage.getItem("userRole") === "admin"
      ) {
        return <Navigate to={"/auth/login"} />;
    
      } else if (
        localStorage.getItem("token") &&
        localStorage.getItem("userRole") === "user"
      ) {
        return children;
      } else {
        return <Navigate to={"/auth/login"} />;
      }
}

export default UserProtectedRoute