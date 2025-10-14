import React from "react";
import { Button, IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { StyledTooltip } from "../../General/TableGrid";
import DownloadIcon from "@mui/icons-material/Download";

const JobsToCSV = ({ data, fileName }) => {
  const getMyDate = (event) => {
    const dd = new Date(event).getUTCDate();
    const mm = new Date(event).getUTCMonth();
    const yy = new Date(event).getFullYear();
    //const ww = getWeekNumber(new Date(event));

    const MiDate = `${dd}/${mm + 1}/${yy}`;
    const MiMont = `${mm + 1}/${yy}`.toString();

    return { ddmmyy: MiDate, mmyy: MiMont };
  };

  const convertToCSV = (objArray) => {
    const array =
      typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    try {
      let str = "Indice,Trabajo,Cliente,Cantidad,Entrega,DeadLine\n";

      for (let i = 0; i < array.length; i++) {
        // Datos del trabajo
        str += `${i + 1},${array[i].Nombre} (${array[i].Tipo[0].name}),${
          array[i].Company.Nombre
        },${array[i].Cantidad},${getMyDate(array[i].Entrega).ddmmyy},${
          array[i].DeadLine
        }\n`;

        // Encabezados para partes
        str += " ,Parte,Tipo,Pags,Colores,Fto.,Material\n";

        // Datos de las partes
        for (let index in array[i].Partes) {
          const parte = array[i].Partes[index];
          str += ` ,${parte.Name},${parte.jobParts[0].Type},${parte.Pages},${parte.ColoresFrente}/${parte.ColoresDorso},${parte.Ancho}x${parte.Alto},${parte.partStock.Tipo} ${parte.partStock.Gramaje}\n`;
        }
      }

      return str;
    } catch (error) {
      return error;
    }
    // Encabezados para trabajos
  };

  const downloadCSV = () => {
    const csvData = new Blob([convertToCSV(data)], { type: "text/csv" });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //{`Download ${fileName}.csv`}

  return (
    <StyledTooltip title={`Download ${fileName}.csv`} arrow>
      <IconButton onClick={downloadCSV}>
        <DownloadIcon color="primary" />
      </IconButton>
    </StyledTooltip>
  );
};

export default JobsToCSV;
