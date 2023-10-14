import {
  Avatar,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Button,
  Paper,
  Stack,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";

// Acordion Imports:
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const JobDetail = (props) => {
  const [expanded, setExpanded] = useState(false);
  const job = props.job;

  const handleChange = (panel) => (event, isExpanded) => {
    console.log("Panel: " + panel);
    setExpanded(isExpanded ? panel : false);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));

  const partDetail = (part) => {
    let myKey = part._id;

    return (
      <Accordion
        key={myKey}
        id={myKey}
        expanded={expanded === myKey}
        onChange={handleChange(myKey)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            {part.jobParts[0].type}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Material: {part.partStock.Nombre_Material}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: "25%" }}>
            <Stack spacing={1}>
              <Item>{part.jobParts[0].type}</Item>
              <Item>
                Formato: {part.Ancho} x {part.Alto}
              </Item>
              <Item>Paginas: {part.Pages}</Item>
              <Item>
                Impresion: {part.ColoresFrente} / {part.ColoresDorso}
              </Item>
              <Item>Material: {part.partStock.Nombre_Material}</Item>
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Container>
      <Card elevation={16}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: "#c3d", minWidth: "fit-content", padding: 1 }}
              variant="rounded"
            >
              {job.Cantidad}
            </Avatar>
          }
          title={job.Nombre}
          subheader={job.Owner?.Name + " " + job.Owner?.LastName}
        />
        <CardContent>
          <h4>Partes: </h4>
          {job.Partes.map((parte) => {
            return partDetail(parte);
          })}
        </CardContent>
      </Card>
    </Container>
  );
};

export default JobDetail;
