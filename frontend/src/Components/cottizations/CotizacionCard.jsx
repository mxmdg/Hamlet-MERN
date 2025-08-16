import React from "react";
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
} from "@mui/material";
import {
  spanishFormat,
  currencyFormat,
} from "../utils/generalData/numbersAndCurrencies";
import { JobViewer } from "../jobViewer/JobViewer";
import ProductionPlan from "../jobViewer/ProductionPlan";

/**
 * Renderiza los datos principales de una cotización.
 * @param {Object} props
 * @param {Object} props.cotizacion - Objeto de cotización a mostrar
 */
const CotizacionCard = ({ cotizacion, job }) => {
  if (!cotizacion) return null;
  const index = cotizacion.data.index;
  const cantidad = cotizacion.data.cantidad || cotizacion.data.quantity;
  const cliente = cotizacion.data.cliente || cotizacion.data.customer;
  const items = job?.Partes || [];
  const jobName = job?.Nombre || "Trabajo sin nombre";
  const resumen = cotizacion.data.data.resumen;
  const total =
    resumen[resumen.length - 1].finishing +
    resumen[resumen.length - 1].print +
    resumen[resumen.length - 1].stock;
  const { fecha, estado, observaciones } = cotizacion.data;

  const quote =
    cotizacion.data?.data?.quoteSettings?.quote || cotizacion.data?.data?.quote;

  return (
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
            {cantidad && <Typography><b>Cantidad:</b> {cantidad}</Typography>}
            {cliente && (
              <Typography variant="body1" gutterBottom>
                <b>Cliente:</b>{" "}
                {cliente.nombre || cliente.razonSocial || cliente}
              </Typography>
            )}
            {fecha && (
              <Typography variant="body1" gutterBottom>
                <b>Fecha:</b> {new Date(fecha).toLocaleDateString()}
              </Typography>
            )}
            {estado && (
              <Typography variant="body1" gutterBottom>
                <b>Estado:</b> {estado}
              </Typography>
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
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <JobViewer job={job} cot={cotizacion.data} />
      </Grid>
    </Grid>
  );
};

export default CotizacionCard;
