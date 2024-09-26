import React from "react";
import { Button, IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import DownloadIcon from "@mui/icons-material/Download";

const DownloadCSV = ({ data, fileName }) => {
  const convertToCSV = (objArray) => {
    const array =
      typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = "";

    for (let i = 0; i < array.length; i++) {
      let line = "";
      for (let index in array[i]) {
        if (line !== "") line += ",";

        line += array[i][index];
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

export default DownloadCSV;
