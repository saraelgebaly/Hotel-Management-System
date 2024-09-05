import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


interface IProps {
    children: React.ReactNode
  }
  
function AdminProtectedRoute({children}: IProps) {
    const navigate = useNavigate()

    useEffect(() => {
      
      if (localStorage.getItem("userRole") === "user") {
        navigate(-1);
      }
    }, [navigate]);
  
    return children;
}

export default AdminProtectedRoute