import React from "react";
import { Outlet } from "react-router-dom";
import SystemHeader from "../components/ui/SystemHeader";
import Navbar from "../components/navbar/Navbar";

const MainLayout: React.FC = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background text-foreground">
      <SystemHeader
        title="TORY CONTROLLER"
        status={{
          type: "fault",
          label: "System Fault",
        }}
      />
      <main className="flex-1 min-h-0 overflow-y-auto mx-10 ">
        <Outlet />
      </main>
      <Navbar className="flex items-center space-x-2 mx-10 mt-2 mb-2" />
    </div>
  );
};

export default MainLayout;
