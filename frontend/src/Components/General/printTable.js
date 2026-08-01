import React from "react";
import ReactDOMServer from "react-dom/server";
import PrintableTable from "./PrintableTable";

// Estilos "tipo Excel" para el documento de impresion: fuente chica,
// grilla fina, A4 vertical con paginado automatico y encabezado
// repetido en cada hoja. Viven aca (no en la app) porque solo se usan
// dentro del iframe de impresion.
const printStyles = `
  @page {
    size: A4 portrait;
    margin: 12mm 10mm;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    color: #000;
  }
  .print-title {
    font-size: 14pt;
    margin: 0 0 2px 0;
  }
  .print-meta {
    font-size: 8pt;
    color: #444;
    margin: 0 0 10px 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5pt;
  }
  thead {
    display: table-header-group; /* se repite en cada pagina */
  }
  tr {
    page-break-inside: avoid;
  }
  th, td {
    border: 1px solid #999;
    padding: 3px 6px;
    line-height: 1.25;
  }
  th {
    background: #ececec;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 8pt;
  }
  tbody tr:nth-of-type(even) {
    background: #fafafa;
  }
`;

/**
 * Renderiza PrintableTable a HTML estatico, lo monta en un iframe oculto
 * (con su propio documento, totalmente aislado de la pagina actual) y
 * dispara el dialogo de impresion del navegador sobre ese iframe.
 * La pagina que el usuario esta viendo no se toca ni se recarga.
 */
export function printTable({ rows, headCells, title }) {
  const bodyHtml = ReactDOMServer.renderToStaticMarkup(
    <PrintableTable rows={rows} headCells={headCells} title={title} />,
  );

  const doc = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>${title || "Impresion"}</title>
    <style>${printStyles}</style>
  </head>
  <body>${bodyHtml}</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const cleanup = () => {
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  };

  iframe.onload = () => {
    const win = iframe.contentWindow;
    win.addEventListener("afterprint", cleanup);
    win.focus();
    win.print();
    // Red de seguridad por si el navegador no dispara "afterprint" en el iframe.
    setTimeout(cleanup, 60000);
  };

  iframe.srcdoc = doc;
}

export default printTable;
