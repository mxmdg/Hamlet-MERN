import Fetch from "../General/Fetch";
import { Container } from "@mui/material";

const MainContainer = (props) => {
  return (
    <Container sx={{ width: "100vw" }}>
      <Fetch
        collection={props.entity}
        {...(props.querySQL !== undefined ? { querySQL: props.querySQL } : {})}
      />
    </Container>
  );
};

export default MainContainer;
