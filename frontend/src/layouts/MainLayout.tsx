import React from "react";
import { Outlet } from "react-router-dom";
import SystemHeader from "../components/ui/SystemHeader";
import Navbar from "../components/navbar/Navbar";

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div>
        <SystemHeader
          title="TORY CONTROLLER"
          status={{
            type: "fault",
            label: "System Fault",
          }}
        />
        <main className="mx-10 mb-2 flex-1 justify-stretch">
          <Outlet />
        </main>

        <Navbar className="flex items-center space-x-2 mx-10 mt-2 mb-2" />
      </div>
    </div>
  );
};

export default MainLayout;
