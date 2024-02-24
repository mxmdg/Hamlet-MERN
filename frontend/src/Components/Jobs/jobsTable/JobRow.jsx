import React from "react";
import {
  Container,
  Grid,
  Typography,
  Divider,
  Box,
  Tooltip,
} from "@mui/material";

const JobRow = (props) => {
  const partsRender = (part) => {
    console.log("Render");
    console.log(part);
    return (
      <Container
        sx={{ background: "#777", border: "1px solid #999", padding: "5px" }}
      >
        <Grid container columns={18} gap={3} key={part._id}>
          <Grid item columns={3}>
            <Typography variant="subtitle2">{part.jobParts[0].Type}</Typography>
          </Grid>
          <Divider />
          <Grid item columns={3}>
            <Typography variant="subtitle2">{part.Name}</Typography>
          </Grid>
          <Divider />
          <Grid item columns={3}>
            <Typography variant="subtitle2">{part.Pages}</Typography>
          </Grid>
          <Divider />
          <Grid item columns={3}>
            <Typography variant="subtitle2">
              {part.Ancho} x {part.Alto} mm
            </Typography>
          </Grid>
          <Divider />
          <Grid item columns={3}>
            <Typography variant="subtitle2">
              {part.ColoresFrente} / {part.ColoresDorso || "0"}
            </Typography>
          </Grid>
          <Divider />
          <Grid item columns={3}>
            <Typography variant="subtitle2">
              {part.partStock.Marca} {part.partStock.Tipo}{" "}
              {part.partStock.Gramaje}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    );
  };

  React.useEffect(() => {}, [partsRender]);
  const render = (
    <Box sx={{ background: "#444", padding: "10px" }}>
      <Grid container columns={24} gap={2}>
        <Grid item columns={3}>
          <Typography color={"primary"} variant="overline">
            {props.job.Nombre}
          </Typography>
        </Grid>
        <Grid item columns={3}>
          <Typography color={"primary"} variant="overline">
            {props.job.Tipo[0].name}
          </Typography>
        </Grid>
        <Grid item columns={1}>
          <Typography color={"primary"} variant="overline">
            {props.job.Cantidad}
          </Typography>
        </Grid>
        <Grid item columns={4}>
          <Tooltip title={props.job.Company.email}>
            <Typography color={"primary"} variant="overline">
              {props.job.Company.Nombre}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item columns={4}>
          <Tooltip title={props.job.Owner?.email}>
            <Typography color={"primary"} variant="overline">
              {props.job.Owner?.Name} {props.job.Owner?.LastName}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item columns={1}>
          <Typography color={"primary"} variant="overline">
            {props.job.Emision}
          </Typography>
        </Grid>
        <Grid item columns={1}>
          <Typography color={"primary"} variant="overline">
            {props.job.DeadLine}
          </Typography>
        </Grid>
      </Grid>
      {props.job.Partes.map((part) => {
        return partsRender(part);
      })}
    </Box>
  );
  return render;
};

export default JobRow;
