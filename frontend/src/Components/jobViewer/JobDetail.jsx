import {
  Avatar,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Paper,
  Stack,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { styled } from "@mui/material/styles";
import ReactTimeAgo from "react-time-ago";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Acordion Imports:
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Navigate, useNavigate } from "react-router-dom";

// Imposition imports
import Canvas from "../utils/impo/Canvas";

export const calcularLomo = (pags, resma) => {
  return Math.ceil(pags / 2) * (resma / 500);
};

const JobDetail = (props) => {
  const [expanded, setExpanded] = useState(false);
  const job = props.job;
  const navigate = useNavigate();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#111" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));

  // Date Format Options:
  const options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const partDetail = (part) => {
    let myKey = part._id;

    return (
      <>
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
            <Grid
              sx={{ maxWidth: "100%", overflow: "auto" }}
              container
              direction={{ xs: "column", md: "row" }}
              spacing={0}
              alignItems={"start"}
            >
              <Grid xs={12} md={4}>
                <Stack spacing={2}>
                  <Item>{part.jobParts[0].type}</Item>
                  <Item>
                    Formato: {part.Ancho} x {part.Alto}
                  </Item>
                  <Item>
                    Paginas: {part.Pages}
                    {part.jobParts[0].type.includes("Interior" || "Insert") ? (
                      <>
                        {" ("}Lomo:{" "}
                        {calcularLomo(part.Pages, part.partStock.Espesor_Resma)}{" "}
                        mm.
                        {")"}
                      </>
                    ) : (
                      ""
                    )}
                  </Item>

                  <Item>
                    Impresion: {part.ColoresFrente} / {part.ColoresDorso}
                  </Item>
                  <Item>
                    Material: {part.partStock.Marca}, {part.partStock.Tipo},{" "}
                    {part.partStock.Gramaje}
                  </Item>
                </Stack>
              </Grid>
              <Grid xs={12} md={8}>
                <Canvas
                  id={part._id}
                  width={700}
                  height={450}
                  part={part}
                ></Canvas>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </>
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
          action={
            <Box>
              <Paper elevation={12} sx={{ background: "#39a" }}>
                <Container sx={{ padding: "15px" }}>
                  <Typography variant="caption" gutterBottom>
                    Emision: <br />
                    {new Date(job.Fecha).toLocaleDateString(undefined, options)}
                    <br />
                    <Divider />
                    Entrega: <br />
                    {new Date(job.Entrega).toLocaleDateString(
                      undefined,
                      options
                    )}
                  </Typography>
                </Container>
                <Container>
                  <ErrorMessage
                    message={
                      <ReactTimeAgo
                        date={Date.parse(job.Entrega)}
                        locale="es-ES"
                      />
                    }
                    severity="warning"
                  />
                </Container>
              </Paper>
            </Box>
          }
          title={job.Nombre}
          subheader={job.Owner ? `${job.Owner.Name} ${job.Owner.LastName}` : ""}
        />
        <CardContent>
          <h4>Partes: </h4>
          <Divider />
          {job.Partes.map((parte) => {
            return partDetail(parte);
          })}
        </CardContent>
        <Divider />
        <CardActions>
          <Container>
            <Button
              //icon={ArrowBackIcon}
              onClick={() => {
                navigate(-1);
              }}
              variant="outlined"
              color="secondary"
              startIcon={<ArrowBackIcon />}
            >
              Volver
            </Button>
          </Container>
        </CardActions>
      </Card>
    </Container>
  );
};

export default JobDetail;
