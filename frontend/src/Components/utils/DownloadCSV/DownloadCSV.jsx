import React from "react";
import { useState, useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { StyledTooltip } from "../../General/TableGrid";
import DownloadIcon from "@mui/icons-material/Download";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import Spinner from "../../General/Spinner";
import { set } from "react-hook-form";

const DownloadCSV = ({ data, fileName, head }) => {
  const [useError, setError] = useState(null);
  const [useLoading, setLoading] = useState(false);

  const convertToCSV = (objArray) => {
    try {
      setLoading(true);
      const array =
        typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
      let str = "";

      // Add headers if provided
      if (head && Array.isArray(head)) {
        str += head.join(",") + "\r\n";
      }

      for (let i = 0; i < array.length; i++) {
        let line = "";
        for (let index in array[i]) {
          if (line !== "") line += ",";

          line += array[i][index];
        }
        str += line + "\r\n";
      }
      setLoading(false);
      return str;
    } catch (error) {
      setLoading(false);
      setError(error.message);
      return null;
    }
  };

  const downloadCSV = () => {
    try {
      setLoading(true);
      const csvData = new Blob([convertToCSV(data)], { type: "text/csv" });
      const csvURL = URL.createObjectURL(csvData);
      const link = document.createElement("a");
      link.href = csvURL;
      link.download = `${fileName}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
      return null;
    }
  };

  //{`Download ${fileName}.csv`}
  const failure = <ErrorMessage message={useError} />;
  const loading = <Spinner message={"Preparando descarga..."} />;

  return useLoading ? (
    loading
  ) : useError !== null ? (
    failure
  ) : (
    <StyledTooltip title={`Download ${fileName}.csv`} arrow>
      <IconButton onClick={downloadCSV}>
        <DownloadIcon color="primary" />
      </IconButton>
    </StyledTooltip>
  );
};

export default DownloadCSV;
