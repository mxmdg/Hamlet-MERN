import { Routes, Route } from "react-router-dom";
import Home from "../Components/home";
import { Login } from "../Components/Users/Login";
import { Register } from "../Components/Users/Register";
import ResetPassword from "../Components/Users/RecoverPassword";

export const publicRoutes = ({ color, variant }) => {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={<Login color={color} variant={variant} />}
      />
      <Route
        path="/register"
        element={<Register color={color} variant={variant} />}
      />
      <Route
        path="/users/reset-password/:token"
        element={<ResetPassword color={color} variant={variant} />}
      />
    </>
  );
};
