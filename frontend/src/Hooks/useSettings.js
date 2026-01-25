import { useContext, useCallback } from "react";
import { AuthContext } from "../Components/context/AuthContext";
import { getPrivateElementByID } from "../Components/customHooks/FetchDataHook";

export const useSettings = () => {
  try {
    const usrSettings = { color: "primary", variant: "standad" };
    console.log(usrSettings);
  } catch (error) {
    console.log(error);
    return { color: "primary", variant: "standard" };
  }

  return { color: "secondary", variant: "filled" };
};
