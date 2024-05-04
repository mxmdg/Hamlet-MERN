import Form from "../Formulario/Form";
import FormDataForm from "../Formulario/FormatDataForm";
import Fetch from "./Fetch";
//import "../../Styles/hamlet.css";
import Container from "@mui/material/Container";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const MainContainer = (props) => {
  return (
    <Container>
      <Fetch collection={props.entity} />
    </Container>
  );
};

export default MainContainer;
