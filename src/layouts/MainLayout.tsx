import React from "react";
import { Outlet } from "react-router-dom";
import SystemHeader from "../components/ui/SystemHeader";

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
    </div>
  );
};

export default MainLayout;
