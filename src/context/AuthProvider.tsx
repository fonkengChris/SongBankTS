import { ReactNode, createContext, useState } from "react";

interface Props {
  children: ReactNode;
}

export type AuthCridentials = {
  auth: {};
  setAuth: ({}) => void;
};

const AuthContext = createContext<AuthCridentials>({} as AuthCridentials);

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
