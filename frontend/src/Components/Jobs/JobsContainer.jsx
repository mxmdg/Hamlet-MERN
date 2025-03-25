//import "../../Styles/hamlet.css";
import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MyStepper from "./Stepper";
import Fetch from "../General/Fetch";

const JobsContainer = (props) => {
  /* return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 1, sm: 4, md: 8 }}
    >
      <Grid item xs={1} sm={2} md={3}>
        <MyStepper />
      </Grid>
      <Grid item xs={1} sm={2} md={4}>
        <Fetch collection={props.entity} />
      </Grid>
    </Grid>
  );*/

  return (
    <>
      <Fetch collection={props.entity} />
    </>
  );
};

export default JobsContainer;

/*
    <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
    >
          <Grid item xs={1} sm={2} md={3}>
            <MyStepper />
          </Grid>
          <Grid item xs={1} sm={2} md={4}>
            <Fetch collection={props.entity} />
          </Grid>
    </Grid>
*/
