import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  isSignedIn: boolean;
  children: ReactNode;
}

const Protected = ({ isSignedIn, children }: Props) => {
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default Protected;
