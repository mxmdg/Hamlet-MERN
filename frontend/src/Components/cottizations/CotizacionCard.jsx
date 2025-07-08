import React from "react";
import {
  spanishFormat,
  currencyFormat,
} from "../utils/generalData/numbersAndCurrencies";

/**
 * Renderiza los datos principales de una cotización.
 * @param {Object} props
 * @param {Object} props.cotizacion - Objeto de cotización a mostrar
 */
const CotizacionCard = ({ cotizacion, job }) => {
  if (!cotizacion) return null;
  // Ejemplo de campos clave, ajusta según tu modelo real
  const index = cotizacion.data.index;
  const cliente = cotizacion.data.cliente || cotizacion.data.customer;
  const items = job?.Partes || [];
  const jobName = job?.Nombre || "Trabajo sin nombre";
  const resumen = cotizacion.data.data.resumen;
  console.log("Resumen de cotización:", resumen);
  const total =
    resumen[resumen.length - 1].finishing +
    resumen[resumen.length - 1].print +
    resumen[resumen.length - 1].stock;
  const { fecha, estado, observaciones } = cotizacion.data;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        margin: 8,
      }}
    >
      <h3>Cotización #{index}</h3>
      <h4>
        Trabajo: <a href={`/jobs/edit/${job?._id}`}>{jobName}</a>
      </h4>
      {cliente && (
        <p>
          <b>Cliente:</b> {cliente.nombre || cliente.razonSocial || cliente}
        </p>
      )}
      {fecha && (
        <p>
          <b>Fecha:</b> {new Date(fecha).toLocaleDateString()}
        </p>
      )}
      {estado && (
        <p>
          <b>Estado:</b> {estado}
        </p>
      )}
      {observaciones && (
        <p>
          <b>Observaciones:</b> {observaciones}
        </p>
      )}
      {items && Array.isArray(items) && items.length > 0 && (
        <div>
          <b>Items:</b>
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>
                {`${item.Name} (${item.jobParts[0].Type})`} - Pags: {item.Pages}{" "}
                - Material: {`${item.partStock.Tipo} ${item.partStock.Gramaje}`}
              </li>
            ))}
          </ul>
        </div>
      )}
      {total && <h4>Costo: {currencyFormat(total)}</h4>}
      {/* Mostrar detalles de la cotización */}
      {cotizacion.data?.data?.quoteSettings?.quote && (
        <div style={{ marginTop: 12 }}>
          <b>Detalles del presupuesto:</b>
          <ul>
            <li>
              Ganancia:{" "}
              {currencyFormat(cotizacion.data.data.quoteSettings.quote.gain)}
            </li>
            <li>
              % Ganancia:{" "}
              {cotizacion.data.data.quoteSettings.quote.utilityPercentage}%
            </li>
            <li>
              Comisión de ventas:{" "}
              {currencyFormat(
                cotizacion.data.data.quoteSettings.quote.salesCommission
              )}
            </li>
            <li>
              IVA:{" "}
              {currencyFormat(cotizacion.data.data.quoteSettings.quote.iva)}
            </li>
            <li>
              <b>Total final:</b>{" "}
              {currencyFormat(cotizacion.data.data.quoteSettings.quote.total)}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CotizacionCard;
