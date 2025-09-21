import { Routes, Route } from "react-router-dom";
import Home from "../Components/home";
import { Login } from "../Components/Users/Login";
import { Register } from "../Components/Users/Register";
import ResetPassword from "../Components/Users/RecoverPassword";

export const publicRoutes = () => {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/users/reset-password/:token" element={<ResetPassword />} />
    </>
  );
};
