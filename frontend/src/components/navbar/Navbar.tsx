import React from "react";
import { MainNavItem, type MainNavItemProps } from "../ui/MainNav";
import { Camera, LayoutGrid, MenuIcon } from "lucide-react";
import { cn } from "../../lib/utils";

const Navbar: React.FC<{ className: string }> = ({ className }) => {
  const navItems: MainNavItemProps[] = [
    {
      to: "/",
      icon: <LayoutGrid />,
      name: "General",
    },
    {
      to: "/camera",
      icon: <Camera />,
      name: "Camera",
    },
    {
      to: "/logs",
      icon: <MenuIcon  />,
      name: "Logs",
    },
  ];

  return (
    <nav className={cn("border-2 rounded-lg border-border p-1 grid grid-rows-1 justify-between items-center", className)}>
      {navItems.map((nav, index) => (
        <MainNavItem {...nav} key={index} />
      ))}
    </nav>
  );
};

export default Navbar;
