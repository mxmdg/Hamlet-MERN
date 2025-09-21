import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Button,
  ButtonGroup,
  CardActionArea,
  CardActions,
} from "@mui/material";
import {
  spanishFormat,
  currencyFormat,
} from "../utils/generalData/numbersAndCurrencies";
import { databaseURL } from "../Config/config";
import { JobViewer } from "../jobViewer/JobViewer";
import {
  patchPrivateElement,
  addPrivateElement,
} from "../customHooks/FetchDataHook";
import ProductionPlan from "../jobViewer/ProductionPlan";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";

/**
 * Renderiza los datos principales de una cotización.
 * @param {Object} props
 * @param {Object} props.cotizacion - Objeto de cotización a mostrar
 */
const CotizacionCard = ({ cotizacion, job }) => {
  const [useError, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Mueve los hooks arriba
  const [localStatus, setLocalStatus] = useState(cotizacion?.data?.status);

  useEffect(() => {
    setLocalStatus(cotizacion?.data?.status);
  }, [cotizacion?.data?.status]);

  if (!cotizacion) return null;
  const index = cotizacion.data.index;
  const cantidad = cotizacion.data.cantidad || cotizacion.data.quantity;
  const cliente = cotizacion.data.cliente || cotizacion.data.customer;
  const items = job?.Partes || [];
  const jobName = job?.Nombre || "Trabajo sin nombre";
  const deadLine = job?.DeadLine;
  const resumen = cotizacion.data.data.resumen;
  const total =
    resumen[resumen.length - 1].finishing +
    resumen[resumen.length - 1].print +
    resumen[resumen.length - 1].stock;
  const { fecha, status, observaciones } = cotizacion.data;

  const quote =
    cotizacion.data?.data?.quoteSettings?.quote || cotizacion.data?.data?.quote;

  const statusUpdater = (newStatus) => {
    try {
      cotizacion.data.status = newStatus;
      setLocalStatus(newStatus); // Actualiza el estado local
      patchPrivateElement("quotations", cotizacion.data._id, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  let itemsList = "";

  if (items && Array.isArray(items) && items.length > 0) {
    itemsList = items
      .map(
        (item) =>
          `${item.Name} (${item.jobParts[0].Type})
       Pags: ${item.Pages} Formato: ${item.Ancho} x ${item.Alto}- Material: ${item.partStock.Tipo} ${item.partStock.Gramaje}`
      )
      .join("\n"); // o "<br/>" si lo vas a meter en HTML
  }

  const quoteMessagePlain = `
Presupuesto Número ${cotizacion.data.index}
Trabajo: ${jobName} - Tipo: ${cotizacion.data.jobType}
Cantidad: ${cotizacion.data.quantity}
${itemsList}
Impuestos: ${cotizacion.data.taxes}
Precio final: ${cotizacion.data.total} (IVA incluido)
`;

  const quoteMessageHTML = `
  <h2>Presupuesto Número ${cotizacion.data.index}</h2>
  <p><b>Trabajo:</b> ${jobName} <br/>
  <b>Tipo:</b> ${cotizacion.data.jobType} <br/>
  <b>Cantidad:</b> ${cotizacion.data.quantity}</p>
  ${
    items && items.length > 0
      ? `
    <h3>Items</h3>
    <ul>
      ${items
        .map(
          (item) => `
        <li><b>${item.Name}</b> ${item.jobParts[0].Type}: ${item.partStock.Tipo} ${item.partStock.Gramaje} — ${item.Pages} páginas formato ${item.Ancho} x ${item.Alto}</li>
      `
        )
        .join("")}
    </ul>
  `
      : ""
  }
  <p><b>Impuestos:</b> ${cotizacion.data.taxes}</p>
  <p style="font-size:1.2em; color:#1976d2;"><b>Precio final:</b> ${currencyFormat(
    cotizacion.data.total
  )} (IVA incluido)</p>
  <hr/>
  <p>Muchas gracias por su consulta,<br/>
  <em>Equipo de Impresiones</em></p>
`;

  const sendQuotation = async () => {
    const body = {
      quotationId: cotizacion.data._id,
      toEmail: "maxiomaro@gmail.com",
      subject: `Presupuesto Número ${cotizacion.data.index}`,
      message: quoteMessagePlain, // versión texto
      html: quoteMessageHTML, // versión HTML
    };

    console.log(body);
    try {
      console.log(`quotations/sendEmail`);
      const res = await addPrivateElement(`quotations/sendEmail`, body);
      setLoading(false);
      setError({
        message: res.data.message,
        severity: "success",
        title: "Presupusto enviado!",
      });
      return res.data;
    } catch (error) {
      setError(error);
    }
  };

  const failure = (
    <ErrorMessage
      title={useError?.title || "Error"}
      severity={useError?.severity || "warning"}
      action={() => {
        setError(null);
      }}
      message={useError?.message}
    />
  );

  const loadingData = <Spinner />;

  const success = (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 2, margin: 2 }}>
          <CardHeader
            title={`Cotización #${index}`}
            subheader={
              <span>
                Trabajo:{" "}
                <a
                  href={`/jobs/edit/${job?._id}`}
                  style={{ textDecoration: "none" }}
                >
                  {jobName}
                </a>
              </span>
            }
            titleTypographyProps={{ variant: "h6", color: "primary" }}
            subheaderTypographyProps={{ variant: "subtitle1" }}
          />
          <Divider />
          <CardContent>
            {cantidad && (
              <Typography>
                <b>Cantidad:</b> {cantidad}
              </Typography>
            )}
            {cliente && (
              <Typography variant="body1" gutterBottom>
                <b>Cliente:</b>{" "}
                {cliente.nombre || cliente.razonSocial || cliente}
              </Typography>
            )}
            {fecha && (
              <Typography variant="body1" gutterBottom>
                <b>Fecha:</b> {new Date(fecha).toLocaleDateString()}
                <br />
                <b>Próxima entrega:</b> {deadLine}
              </Typography>
            )}
            {localStatus && (
              <>
                <Typography variant="body1" gutterBottom>
                  <b>Estado:</b> {localStatus}
                </Typography>
                <Divider />
                <ButtonGroup fullWidth variant="outlined" sx={{ mb: 2 }}>
                  {["Pendiente", "Aprobada", "Rechazada"].map(
                    (statusOption) => (
                      <Button
                        key={statusOption}
                        onClick={() => statusUpdater(statusOption)}
                        variant={
                          localStatus === statusOption
                            ? "contained"
                            : "outlined"
                        }
                        color={
                          localStatus === "Aprobada"
                            ? "success"
                            : localStatus === "Rechazada"
                            ? "error"
                            : "warning"
                        }
                      >
                        {statusOption}
                      </Button>
                    )
                  )}
                </ButtonGroup>
              </>
            )}
            {observaciones && (
              <Typography variant="body1" gutterBottom>
                <b>Observaciones:</b> {observaciones}
              </Typography>
            )}
            {items && Array.isArray(items) && items.length > 0 && (
              <>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <b>Items:</b>
                </Typography>
                <List dense>
                  {items.map((item, idx) => (
                    <ListItem key={idx} sx={{ pl: 2 }}>
                      <ListItemText
                        primary={`${item.Name} (${item.jobParts[0].Type})`}
                        secondary={
                          <>
                            Pags: {item.Pages} - Material:{" "}
                            {`${item.partStock.Tipo} ${item.partStock.Gramaje}`}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            {total && (
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                Costo: {currencyFormat(total)}
              </Typography>
            )}
            {/* Mostrar detalles de la cotización */}
            {quote && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  <b>Detalles del presupuesto:</b>
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Ganancia"
                      secondary={currencyFormat(quote.gain)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="% Ganancia"
                      secondary={`${spanishFormat(quote.utilityPercentage)}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Comisión de ventas"
                      secondary={currencyFormat(quote.salesCommission)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="IVA"
                      secondary={currencyFormat(quote.iva)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={<b>Total final</b>}
                      secondary={
                        <Typography color="primary" variant="h6">
                          {currencyFormat(quote.total)}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </>
            )}
          </CardContent>
          <CardActionArea>
            <CardActions>
              <ButtonGroup fullWidth variant="outlined" sx={{ mb: 2 }}>
                <Button
                  key={"sendMail"}
                  onClick={() => sendQuotation(cotizacion)}
                  variant="contained"
                  color="primary"
                >
                  Enviar
                </Button>
              </ButtonGroup>
            </CardActions>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <JobViewer job={job} cot={cotizacion.data} />
      </Grid>
    </Grid>
  );

  return loading ? loadingData : useError !== null ? failure : success;
};

export default CotizacionCard;
