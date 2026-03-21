import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../Config/config";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getPrivateElements } from "../customHooks/FetchDataHook";

export const AuthContext = React.createContext();

// Función auxiliar para obtener datos seguros de localStorage
export const getStoredItem = (key, isJson = false) => {
  const item = localStorage.getItem(key);
  if (!item || item === "undefined") return null;
  return isJson ? JSON.parse(item) : item;
};

const AuthProvider = ({ children }) => {
  const [useLogin, setLogin] = useState(!!localStorage.getItem("login"));
  const [useToken, setToken] = useState(localStorage.getItem("token"));
  const [userLogged, setUserLogged] = useState(getStoredItem("user", true));
  const [memberships, setMemberships] = useState(
    getStoredItem("memberships", true) || [],
  );

  const Navigate = useNavigate();

  // Derivamos estados de las memberships cargadas
  const [usePlan, setPlan] = useState(
    memberships.length > 0 ? memberships[0].tenant.plan : null,
  );
  const [useSettings, setSettings] = useState(
    memberships.length > 0 ? memberships[0].tenant.settings : null,
  );

  const handleLogin = (token, expirationTime, user, membershipsData) => {
    // Seteamos logout automático
    setTimeout(() => handleLogout(), expirationTime - Date.now());

    if (Date.now() < expirationTime) {
      setLogin(true);
      setToken(token);
      setUserLogged(user);
      setMemberships(membershipsData);

      // Actualizamos estados derivados inmediatamente
      if (membershipsData && membershipsData.length > 0) {
        setPlan(membershipsData[0].tenant.plan);
        setSettings(membershipsData[0].tenant.settings);
      }

      // GUARDADO CORRECTO EN LOCALSTORAGE
      localStorage.setItem("login", "true");
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("memberships", JSON.stringify(membershipsData)); // CLAVE: JSON.stringify
    }
  };

  const handleLogout = () => {
    setLogin(false);
    setToken(null);
    setUserLogged(null);
    setMemberships([]);
    setPlan(null);
    setSettings(null);
    localStorage.removeItem("login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("memberships");
    Navigate("/");
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
  }, [useLogin, useToken]);

  return (
    <AuthContext.Provider
      value={{
        useLogin,
        handleLogin,
        handleLogout,
        useToken,
        userLogged,
        usePlan,
        useSettings,
        memberships,
        setUserLogged,
        setMemberships,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
