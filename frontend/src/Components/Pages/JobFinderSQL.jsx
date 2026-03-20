import React from "react";

//My componentes imports
import Fetch from "../General/Fetch";

//MUI Material imports
import { Container } from "@mui/material";

const JobFinderSQL = (props) => {
  return (
    <Container sx={{ width: "100vw" }}>
      <Fetch
        collection={props.entity}
        {...(props.querySQL !== undefined ? { querySQL: props.querySQL } : {})}
      />
    </Container>
  );
};

export default JobFinderSQL;
