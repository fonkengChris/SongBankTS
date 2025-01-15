import { ReactNode, createContext, useState } from "react";
import { Auth } from "../entities/Auth";

interface Props {
  children: ReactNode;
}

export type AuthCridentials = {
  auth: Auth;
  setAuth: (auth: Auth) => void;
};

const AuthContext = createContext<AuthCridentials>({} as AuthCridentials);

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth: {} as Auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
