import React from "react";
import { IconButton } from "@mui/material";
import { StyledTooltip } from "../../General/TableGrid";
import DownloadIcon from "@mui/icons-material/Download";

const JobsToCSV = ({ data, fileName }) => {
  const getMyDate = (event) => {
    if (!event) return { ddmmyy: "", mmyy: "" };

    const d = new Date(event);
    const dd = d.getUTCDate();
    const mm = d.getUTCMonth() + 1;
    const yy = d.getUTCFullYear();

    return {
      ddmmyy: `${dd}/${mm}/${yy}`,
      mmyy: `${mm}/${yy}`,
    };
  };

  const convertToCSV = (objArray) => {
    const array =
      typeof objArray !== "object" ? JSON.parse(objArray) : objArray;

    try {
      let str = "Indice,Trabajo,Cliente,Cantidad,Entrega,DeadLine\n";

      for (let i = 0; i < array.length; i++) {
        const job = array[i];

        const tipoTrabajo = job.Tipo?.[0]?.name ?? "Sin tipo";
        const cliente = job.Company?.Nombre ?? "Sin cliente";
        const entrega = getMyDate(job.Entrega).ddmmyy;

        // Datos del trabajo
        str += `${i + 1},${job.Nombre} (${tipoTrabajo}),${cliente},${
          job.Cantidad ?? ""
        },${entrega},${job.DeadLine ?? ""}\n`;

        // Encabezado partes
        str += " ,Parte,Tipo,Pags,Colores,Fto.,Material\n";

        // Datos de partes
        job.Partes?.forEach((parte) => {
          str += ` ,${parte?.Name ?? "—"},${
            parte?.jobParts?.[0]?.Type ?? "—"
          },${parte?.Pages ?? ""},${
            parte?.ColoresFrente ?? ""
          }/${parte?.ColoresDorso ?? ""},${
            parte?.Ancho ?? ""
          }x${parte?.Alto ?? ""},${
            parte?.partStock?.Tipo ?? ""
          } ${parte?.partStock?.Gramaje ?? ""}\n`;
        });
      }

      return str;
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const downloadCSV = () => {
    const csvData = new Blob([convertToCSV(data)], {
      type: "text/csv;charset=utf-8;",
    });

    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <StyledTooltip title={`Download ${fileName}.csv`} arrow>
      <IconButton onClick={downloadCSV}>
        <DownloadIcon color="primary" />
      </IconButton>
    </StyledTooltip>
  );
};

export default JobsToCSV;
