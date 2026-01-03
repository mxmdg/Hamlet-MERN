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
import { CotizationMail } from "./CotizationMail";

/**
 * Renderiza los datos principales de una cotización.
 * @param {Object} props
 * @param {Object} props.cotizacion - Objeto de cotización a mostrar
 */
const CotizacionCard = ({ cotizacion, job }) => {
  const [useError, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [waitingFor, setWaitingFor] = useState(null);
  // Mueve los hooks arriba
  const [localStatus, setLocalStatus] = useState(cotizacion?.data?.status);

  useEffect(() => {
    setLocalStatus(cotizacion?.data?.status);
  }, [cotizacion?.data?.status, cotizacion?.data]);

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

  

  const {quoteMessageHTML, quoteMessagePlain, itemsList} = CotizationMail({ cotizacion, cliente, items, jobName });


  const sendQuotation = async () => {
    setLoading(true);
    setWaitingFor("Enviando presupuesto...");

    const body = {
      quotationId: cotizacion.data._id,
      toEmail: "maxiomaro@gmail.com", // cliente.email,
      subject: `Presupuesto Número ${cotizacion.data.index} - ${jobName}`,
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
      statusUpdater("Enviado");
      setWaitingFor(null);
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

  const loadingData = <Spinner title={waitingFor === null ? "Cargando..." : waitingFor} />;

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
                  {["Pendiente", "Aprobado", "Rechazado"].map(
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
                          localStatus === "Aprobado"
                            ? "success"
                            : localStatus === "Rechazado"
                            ? "error"
                            : localStatus === "Enviado"
                            ? "success"
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
                      primary="Precio Unitario"
                      secondary={currencyFormat(quote.total / cantidad)}
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
            <CardActions>
                <Button
                  key={"sendMail"}
                  onClick={() => sendQuotation(cotizacion)}
                  variant="contained"
                  color={localStatus === "Enviado" ? "success" : "primary"}
                >
                  {localStatus === "Enviado"
                    ? "Reenviar Presupuesto"
                    : "Enviar Presupuesto"}
                </Button>
            </CardActions>
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
