import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoutes: React.FC = () => {
  const { loadFromLocalStorage } = useAuth();
  const data = loadFromLocalStorage();
  const navigate = useNavigate();

  const isAuthenticated = data?.isAuthenticated;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return <Outlet />;
  }

  return null;
};

export default ProtectedRoutes;
