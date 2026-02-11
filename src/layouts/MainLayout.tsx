import React from "react";
import { Outlet } from "react-router-dom";
import SystemHeader from "../components/ui/SystemHeader";
import Navbar from "../components/navbar/Navbar";

const MainLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div>
        <SystemHeader
          title="TORY CONTROLLER"
          status={{
            type: "fault",
            label: "System Fault",
          }}
        />
        <div className="mx-10 mt-2 mb-2">
          <Outlet />
        </div>

        <Navbar className="absolute bottom-2 left-0 right-0 flex items-center space-x-2 mx-10 mt-2 mb-2" />
      </div>
    </div>
  );
};

export default MainLayout;
