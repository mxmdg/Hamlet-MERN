import React from "react";
import { Button, IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import DownloadIcon from "@mui/icons-material/Download";

const DownloadJSON = ({ data, fileName }) => {
  const downloadJSON = () => {
    const jsonData = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    const jsonURL = URL.createObjectURL(jsonData);
    const link = document.createElement("a");
    link.href = jsonURL;
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Tooltip title={`Descargar ${fileName}.json`}>
      <IconButton onClick={downloadJSON}>
        <DownloadIcon color="secondary" />
      </IconButton>
    </Tooltip>
  );
};

export default DownloadJSON;
