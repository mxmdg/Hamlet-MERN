import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ImpoContext = React.createContext();

const ImpoProvider = ({ children }) => {
  const [useImpoData, setImpoData] = useState({
    sheetWidth: 450,
    sheetHeight: 320,
    pageWidth: 90,
    pageHeight: 50,
    spacing: 0,
    margin: 0,
  });

  return (
    <ImpoContext.Provider
      value={{
        useImpoData,
        setImpoData,
      }}
    >
      {children}
    </ImpoContext.Provider>
  );
};

export default ImpoProvider;
