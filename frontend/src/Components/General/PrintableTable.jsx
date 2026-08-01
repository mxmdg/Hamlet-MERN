import React from "react";
import { spanishFormat } from "../utils/generalData/numbersAndCurrencies";
import { handleDate } from "../utils/generalData/fechaDiccionario";

// Mismas reglas de formato que usa la tabla en pantalla (TableGrid.jsx):
// oculta columnas tipo "id" y formatea numeros/fechas.
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const isIdField = (key) => typeof key === "string" && /id$/i.test(key);

const formatCell = (value) => {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "object") return "N/A";
  if (typeof value === "number") return spanishFormat(value);
  if (typeof value === "string" && isoDateRegex.test(value)) {
    return handleDate(value);
  }
  return String(value);
};

/**
 * Tabla "limpia" (sin MUI, sin checkboxes, sin acciones) pensada
 * unicamente para imprimirse. No se renderiza en la pantalla normal:
 * printTable.js la vuelca a HTML y la manda a un iframe oculto.
 */
const PrintableTable = ({ rows = [], headCells = [], title = "" }) => {
  const visibleHeadCells = (headCells || []).filter(
    (h) => !isIdField(h.id) && h.id !== "_id",
  );

  return (
    <div className="print-table-wrapper">
      {title ? <h1 className="print-title">{title}</h1> : null}
      <p className="print-meta">
        {rows.length} registro{rows.length === 1 ? "" : "s"} · impreso el{" "}
        {new Date().toLocaleDateString("es-AR")}
      </p>
      <table>
        <thead>
          <tr>
            {visibleHeadCells.map((h) => (
              <th
                key={h.id}
                style={{ textAlign: h.numeric ? "right" : "left" }}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row._id ? `${row._id}-${index}` : index}>
              {visibleHeadCells.map((h) => (
                <td
                  key={h.id}
                  style={{ textAlign: h.numeric ? "right" : "left" }}
                >
                  {formatCell(row[h.id])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintableTable;
