import React from "react";
import { MainNav, MainNavItem, type MainNavItemProps } from "../ui/MainNav";
import { Camera, HomeIcon, MenuIcon } from "lucide-react";

const Navbar: React.FC = () => {
  const navItems: MainNavItemProps[] = [
    {
      to: "/general",
      icon: <HomeIcon />,
      name: "General",
    },
    {
      to: "/camera",
      icon: <Camera />,
      name: "Camera",
    },
    {
      to: "/logs",
      icon: <MenuIcon />,
      name: "Logs",
    },
  ];

  return (
    <MainNav>
      {navItems.map((nav, index) => (
        <MainNavItem {...nav} key={index} />
      ))}
    </MainNav>
  );
};

export default Navbar;
