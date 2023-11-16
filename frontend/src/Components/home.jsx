import { useContext } from "react";

import Canvas from "./utils/impo/Canvas";
import ImpoProvider from "./utils/impo/ImpoContext";
import { ImpoContext } from "./utils/impo/ImpoContext";
import Fetch from "./General/Fetch";

//MUI Material Imports
import { Container, Grid, Typography, Divider } from "@mui/material";

const Home = () => {
  const getToken = () => {
    const tkn = localStorage.getItem("token");
    return tkn;
  };

  const context = useContext(ImpoContext);

  return (
    <Container>
      <Typography variant="h3" color={"primary"} gutterBottom>
        Welcome to hamlet
      </Typography>
      <Divider />
      <Typography variant="subtitle" color={"secondary"} gutterBottom>
        Token: {getToken() ? "Habilitado" : "Inhabilitado"}
      </Typography>
      <Divider />
        <Fetch collection="jobs/urg" />
      <Divider />
        <ImpoProvider>
          <Canvas></Canvas>
        </ImpoProvider>
    </Container>
  );
};

export default Home;
