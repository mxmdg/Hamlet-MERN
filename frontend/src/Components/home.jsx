import { useContext } from "react";

import Canvas from "./utils/impo/Canvas";
import ImpoProvider from "./utils/impo/ImpoContext";
import { ImpoContext } from "./utils/impo/ImpoContext";
import Fetch from "./General/Fetch";
import QuickSpinCalc from "./utils/spinCalculator/QuickSpinCalc";

//MUI Material Imports
import { Container, Grid, Typography, Divider } from "@mui/material";

const Home = () => {
  const getToken = () => {
    const tkn = localStorage.getItem("token");
    return tkn;
  };

  const context = useContext(ImpoContext);

  return (
    <Container maxWidth="xl">
    
      <Grid container spacing="3">
        
        <Grid item sm="12" md="4" xl="4">
          <QuickSpinCalc />
        </Grid>
        <Grid item sm="12" md="8" xl="8">
          <ImpoProvider>
            <Canvas></Canvas>
          </ImpoProvider>
        </Grid>
        <Grid item sm="12" md="8" xl="8">
          <Fetch collection="jobs/urg" /> 
        </Grid>
      </Grid>
      
      <Divider />
      <Typography variant="subtitle" color={"secondary"} gutterBottom>
        Token: {getToken() ? "Habilitado" : "Inhabilitado"}
      </Typography>
      
        
    </Container>
  );
};

export default Home;
