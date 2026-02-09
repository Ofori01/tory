import React from "react";
import { Outlet } from "react-router-dom";
import SystemHeader from "../components/ui/SystemHeader";
import Navbar from "../components/navbar/Navbar";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SystemHeader
        title="TORY CONTROLLER"
        status={{
          type: "fault",
          label: "System Fault",
        }}
      />
      <div className="">
        <Outlet />
      </div>

      <Navbar />
    </div>
  );
};

export default MainLayout;
