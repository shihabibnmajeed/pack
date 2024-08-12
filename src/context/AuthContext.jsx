import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthDataProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null); // Add username state

  return (
    <AuthContext.Provider value={{ token, setToken, username, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
