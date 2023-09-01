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
  const [userLogged, setUserLogged ] = useState({})
  const Navigate = useNavigate();

  const handleLogin = (token) => {
    setLogin(true);
    localStorage.setItem("login", true);
    setToken(token);
    localStorage.setItem("token", token);
    Navigate("/users");
    console.log('Login exitoso')
  };

  const handleLogout = () => {
    setLogin(false);
    localStorage.removeItem("login");
    setToken({});
    localStorage.removeItem("token");
    setUserLogged({})
    Navigate("/");
    console.log('Logout exitoso')
  };
  return (
    <AuthContext.Provider
      value={{ useLogin, handleLogin, handleLogout, useToken, userLogged, setUserLogged  }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
