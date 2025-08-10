import React from "react";
import { Button } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";

interface LogoutButtonProps {
  variant?: "solid" | "outline" | "ghost" | "link";
  colorScheme?: string;
  size?: "xs" | "sm" | "md" | "lg";
  children?: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "outline",
  colorScheme = "red",
  size = "md",
  children = "Logout"
}) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      variant={variant}
      colorScheme={colorScheme}
      size={size}
      onClick={handleLogout}
    >
      {children}
    </Button>
  );
};

export default LogoutButton;
