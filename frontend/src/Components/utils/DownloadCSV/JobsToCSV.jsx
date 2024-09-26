import React from "react";
import { Button, IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
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
    let str = "";
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      let line = `_____________________________________
      (# ${i + 1}) ${array[i].Nombre} (${array[i].Tipo[0].name})
      _________________________________________________
      Cliente: ${array[i].Company.Nombre}
      Cantidad ${array[i].Cantidad}, ${getMyDate(array[i].Entrega).ddmmyy} (${
        array[i].DeadLine
      })
      `;
      for (let index in array[i].Partes) {
        if (line !== "") line += " ";

        line += `${array[i].Partes[index].jobParts[0].Type}, ${array[i].Partes[index].Name}, 
          Pags: ${array[i].Partes[index].Pages}, 
          Colores: ${array[i].Partes[index].ColoresFrente} / ${array[i].Partes[index].ColoresDorso}, 
          Fto.: ${array[i].Partes[index].Ancho} x ${array[i].Partes[index].Alto}, 
          Material: ${array[i].Partes[index].partStock.Tipo} ${array[i].Partes[index].partStock.Gramaje}
          ....................................................
          `;
      }
      str += line + "\r\n";
    }
    return str;
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
    <Tooltip title={`Download ${fileName}.csv`}>
      <IconButton onClick={downloadCSV}>
        <DownloadIcon color="primary" />
      </IconButton>
    </Tooltip>
  );
};

export default JobsToCSV;
