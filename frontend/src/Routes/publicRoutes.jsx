import { Routes, Route } from "react-router-dom";
import Home from "../Components/home";
import { Login } from "../Components/Users/Login";
import { Register } from "../Components/Users/Register";
import ResetPassword from "../Components/Users/RecoverPassword";
import FormMaterial from "../Components/Formulario/FormMaterial";
import tenantsDataForm from "../Components/Formulario/tenantsDataForm";
import { Container } from "@mui/material";

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
        element={
          <Container
            height="100vh"
            maxWidth="sm"
            sx={{ padding: "auto", margin: "auto", alignItems: "center" }}
          >
            <FormMaterial
              form={tenantsDataForm}
              collection="tenants"
              task="new"
              title="Registrar imprenta"
              subtitle="Crea tu cuenta y comienza a gestionar tu imprenta hoy mismo"
              submitText={"Registrar Imprenta"}
              variant={variant}
              color={color}
            />
          </Container>
        }
      />
      <Route
        path="/users/reset-password/:token"
        element={<ResetPassword color={color} variant={variant} />}
      />
    </>
  );
};
