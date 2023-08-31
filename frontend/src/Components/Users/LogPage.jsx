import React from "react";
import Container from "@mui/material/Container";
import { Register } from "./Register";
import { Login } from "./Login";

export const LogPage = () => {
  return (
    <Container>
      <h1>Login:</h1>
      <Login />
      <h1>Register:</h1>
      <Register />
    </Container>
  );
};
