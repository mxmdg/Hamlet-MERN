import * as React from "react";
import Stack from "@mui/material/Stack";
import {
  Container,
  CircularProgress,
  LinearProgress,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";

export default function Spinner(props) {
  return (
    <Container>
      <Card>
        <CardHeader title={props.title || "Cargando datos"} />
        <CardContent>
          <LinearProgress color={props.color} />
        </CardContent>
      </Card>
    </Container>
  );
}
