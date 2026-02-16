import React from "react";
import { Outlet } from "react-router-dom";

const ProtectedRoutes: React.FC = () => {
  return <Outlet />;
};

export default ProtectedRoutes;
