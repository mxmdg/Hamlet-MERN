import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [useLogin, setLogin] = useState(
    localStorage.getItem("login") ? true : false
  );
  const [useToken, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : {}
  );
  const Navigate = useNavigate();

  const handleLogin = (token) => {
    setLogin(true);
    localStorage.setItem("login", true);
    setToken(token);
    localStorage.setItem("token", token);
    Navigate("/perfil");
  };

  const handleLogout = () => {
    setLogin(false);
    localStorage.removeItem("login");
    setToken({});
    localStorage.removeItem("token");
    Navigate("/");
  };
  return (
    <AuthContext.Provider
      value={{ useLogin, handleLogin, handleLogout, useToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
