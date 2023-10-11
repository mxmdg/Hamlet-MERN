//import "../../Styles/hamlet.css";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MyStepper from "./Stepper";
import Fetch from "../General/Fetch";

const JobsContainer = (props) => {
  return (
    <Stack direction="row" spacing={2}>
      <MyStepper />
      <Fetch collection={props.entity} />
    </Stack>
  );
};

export default JobsContainer;
