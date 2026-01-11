import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../Config/config";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getPrivateElements } from "../customHooks/FetchDataHook";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [useLogin, setLogin] = useState(
    localStorage.getItem("login") ? true : false
  );
  const [useToken, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );
  const [userLogged, setUserLogged] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const [memberships, setMemberships] = useState(() => {
    try {
      const stored = localStorage.getItem("memberships");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const Navigate = useNavigate();

  const handleLogout = () => {
    setLogin(false);
    localStorage.removeItem("login");
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("memberships");
    setMemberships([]);
    setUserLogged(null);
    Navigate("/");
    console.log("Logout exitoso");
  };

  const handleLogin = (token, expirationTime, user, memberships) => {
    setTimeout(() => {
      handleLogout();
    }, expirationTime - Date.now());

    if (Date.now() < expirationTime) {
      setLogin(true);
      localStorage.setItem("login", true);

      setToken(token);
      localStorage.setItem("token", token);

      setUserLogged(user);
      localStorage.setItem("user", JSON.stringify(user));

      setMemberships(memberships);
      localStorage.setItem("memberships", memberships);
    }
  };

  const validateToken = () => {
    const decodeToken = jwtDecode(useToken);
    if (decodeToken.exp < Date.now() / 1000) {
      handleLogout();
    }
  };

  useEffect(() => {
    if (useToken !== null) {
      validateToken();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        useLogin,
        handleLogin,
        handleLogout,
        useToken,
        userLogged,
        setUserLogged,
        memberships,
        setMemberships,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
