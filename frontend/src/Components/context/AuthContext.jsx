import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [useLogin, setLogin] = useState(
    localStorage.getItem("login") ? true : false
  );
  const [useToken, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : {}
  );
  const [userLogged, setUserLogged] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
  );
  const Navigate = useNavigate();

  const handleLogout = () => {
    setLogin(false);
    localStorage.removeItem("login");
    setToken({});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserLogged({});
    Navigate("/");
    console.log("Logout exitoso");
  };

  const handleLogin = (token, expirationTime) => {
    console.log(expirationTime, Date.now());
    console.log(expirationTime - Date.now());
    setTimeout(() => {
      console.log("El tiempo se terminó");
      handleLogout();
    }, expirationTime - Date.now());

    if (Date.now() < expirationTime) {
      setLogin(true);
      localStorage.setItem("login", true);
      setToken(token);
      localStorage.setItem("token", token);
      Navigate(-1);
      console.log("Login exitoso");
    } else {
      handleLogout();
      return { message: "El password ha expirado" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        useLogin,
        handleLogin,
        handleLogout,
        useToken,
        userLogged,
        setUserLogged,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
