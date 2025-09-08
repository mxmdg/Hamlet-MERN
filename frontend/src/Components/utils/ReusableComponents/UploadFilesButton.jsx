import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Divider, Paper, Tooltip, Typography } from "@mui/material";
import { getDateAndTime } from "../generalData/fechaDiccionario";
import { VALIDATE_PDF } from "../../Config/config";
import { StyledTooltip } from "../../General/TableGrid";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const handleUploadSuccess = (data) => {
  alert(
    `Uploaded PDF with ${data.pages.length} pages and size ${data.size} KB.`
  );
};

const calculateMostCommonSize = (pages) => {
  const sizeMap = new Map();
  pages.forEach((page) => {
    const sizeKey = `${Math.round(page.size.trimbox.width)}x${Math.round(
      page.size.trimbox.height
    )}`;
    sizeMap.set(sizeKey, (sizeMap.get(sizeKey) || 0) + 1);
  });

  let mostCommonSize = null;
  let maxCount = 0;
  sizeMap.forEach((count, size) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonSize = size;
    }
  });

  return mostCommonSize;
};

export default function UploadFilesButton({
  uploadUrl = VALIDATE_PDF, //|| "http://127.0.0.2:8000/upload",
  onUploadSuccess,
  expectedPageCount,
  expectedSize,
}) {
  const [fileInfo, setFileInfo] = useState(null);

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;

    const file = files[0];
    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Upload failed with status:",
          response.status,
          "Response:",
          errorText
        );
        throw new Error("Failed to upload file.");
      }

      const data = await response.json();
      setFileInfo(data);

      const mostCommonSize = calculateMostCommonSize(data.pages);
      const mismatchedPages = data.pages.filter(
        (page) =>
          `${Math.round(page.size.trimbox.width)}x${Math.round(
            page.size.trimbox.height
          )}` !== mostCommonSize
      );

      if (mismatchedPages.length > 0) {
        alert(
          `Warning: The following pages have sizes that do not match the most common size (${mostCommonSize}):\n` +
            mismatchedPages
              .map(
                (page) =>
                  `Page ${page.page_number}: ${Math.round(
                    page.size.trimbox.width
                  )}x${Math.round(page.size.trimbox.height)} mm`
              )
              .join("\n")
        );
      }

      if (
        data.page_count !== expectedPageCount ||
        mostCommonSize !== expectedSize
      ) {
        alert(
          `Mismatch detected:\nExpected pages: ${expectedPageCount}, Actual: ${data.page_count}\n` +
            `Expected size: ${expectedSize}, Most common size: ${mostCommonSize}`
        );
      }

      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (error) {
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        console.error("Network error or CORS issue:", error);
        alert(
          "Network error or server is unreachable. Please check your connection or contact support."
        );
      } else {
        console.error("Error uploading file:", error);
        alert("Error uploading file. Please try again.");
      }
    }
  };

  return (
    <div>
      <Divider />
      <Paper rounded={"false"} sx={{ padding: 2, marginTop: 2 }}>
        <StyledTooltip title="Subir y validar un archivo PDF" arrow>
          <Button
            component="label"
            variant="text"
            color="info"
            startIcon={<CloudUploadIcon />}
        >
          Validar PDF
          <VisuallyHiddenInput
            type="file"
            accept="application/pdf"
            onChange={(event) => handleFileUpload(event.target.files)}
          />
        </Button>
        </StyledTooltip>

        {fileInfo && (
          <List sx={{ marginTop: 2 }}>
            <ListItem>
              <ListItemText
                primary={`${fileInfo.file_name} (${fileInfo.page_count} paginas)`}
                secondary={`Tamaño principal: ${calculateMostCommonSize(
                  fileInfo.pages
                )}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary={`ubicacion del archivo: ${fileInfo.file_path}`}
                />
            </ListItem>
            <Typography variant="body2" color="text.secondary">
              Informacion del documento
              <br />
              Productor: {fileInfo.metadata["/Producer"]}
              <br />
              Creador: {fileInfo.metadata["/Creator"]}
              <br />
              Creado: {getDateAndTime(fileInfo.metadata["/CreationDate"]).dateAndTime}
              <br />
              Modificado: {getDateAndTime(fileInfo.metadata["/ModDate"]).dateAndTime}
            </Typography>
            {fileInfo.pages
              .filter(
                (file) =>
                  `${Math.round(file.size.trimbox.width)}x${Math.round(
                    file.size.trimbox.height
                  )}` !== calculateMostCommonSize(fileInfo.pages)
              )
              .map((file) => (
                <ListItem key={file.id}>
                  <ListItemText
                    primary={`Pagina: ${file.page_number}`}
                    secondary={`Tamaño: ${Math.round(
                      parseFloat(file.size.trimbox.width)
                    )} x ${Math.round(
                      parseFloat(file.size.trimbox.height)
                    )} mm`}
                  />
                </ListItem>
              ))}
          </List>
        )}
      </Paper>
    </div>
  );
}
