import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {
  Card,
  CardContent,
  Divider,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { getDateAndTime } from "../generalData/fechaDiccionario";
import { VALIDATE_PDF } from "../../Config/config";
import { StyledTooltip } from "../../General/TableGrid";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import Spinner from "../../General/Spinner";

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
    `Uploaded PDF with ${data.pages.length} pages and size ${data.size} KB.`,
  );
};

const calculateMostCommonSize = (pages) => {
  const sizeMap = new Map();
  pages.forEach((page) => {
    const sizeKey = `${Math.round(page.size.trimbox.width)}x${Math.round(
      page.size.trimbox.height,
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
  uploadUrl = "http://127.0.0.2:8000/upload",
  onUploadSuccess,
  expectedPageCount,
  expectedSize,
}) {
  const [fileInfo, setFileInfo] = useState(null);
  const [usePlan, setPlan] = useState(
    localStorage.getItem("memberships")
      ? JSON.parse(localStorage.getItem("memberships"))[0].tenant.plan
      : null,
  );
  const [useError, setError] = useState(false);
  const [useLoading, setLoading] = useState(false);
  const handleFileUpload = async (files) => {
    setLoading(true);
    if (files.length === 0) {
      setLoading(false);
      setError({
        title: "No se seleccionó archivo",
        message: "Por favor seleccione un archivo PDF válido.",
      });
      return;
    }

    const file = files[0];
    if (file.type !== "application/pdf") {
      setLoading(false);
      setError({
        title: "Tipo de archivo inválido",
        message: "Por favor seleccione un archivo PDF válido.",
      });
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
        setLoading(false);
        const errorText = await response.text();
        setError({
          title: "Error al subir el archivo",
          message: `El servidor respondió con un error: ${response.status} ${response.statusText}`,
        });
        return;
      }

      const data = await response.json();
      setLoading(false);
      setFileInfo(data);

      const mostCommonSize = calculateMostCommonSize(data.pages);
      const mismatchedPages = data.pages.filter(
        (page) =>
          `${Math.round(page.size.trimbox.width)}x${Math.round(
            page.size.trimbox.height,
          )}` !== mostCommonSize,
      );

      if (mismatchedPages.length > 0) {
        alert(
          `Warning: The following pages have sizes that do not match the most common size (${mostCommonSize}):\n` +
            mismatchedPages
              .map(
                (page) =>
                  `Page ${page.page_number}: ${Math.round(
                    page.size.trimbox.width,
                  )}x${Math.round(page.size.trimbox.height)} mm`,
              )
              .join("\n"),
        );
      }

      if (
        data.page_count !== expectedPageCount ||
        mostCommonSize !== expectedSize
      ) {
        setLoading(false);
        setError({
          message: `Diferencias detectadas:\nPaginas esperadas: ${expectedPageCount}, paginas recibidas: ${data.page_count}\nTamaño esperado: ${expectedSize}, tamaño mas común: ${mostCommonSize}`,
          title:
            "El archivo PDF no coincide con las especificaciones esperadas",
          severity: "info",
        });
        return;
      }

      if (onUploadSuccess) {
        setLoading(false);
        onUploadSuccess(data);
      }
    } catch (error) {
      setLoading(false);
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        setError({
          title: "Error de red",
          message:
            "No se pudo conectar al servidor. Por favor revise su conexión o contacte al soporte.",
        });
      } else {
        setError({
          title: "Error al subir el archivo",
          message: "Ocurrió un error inesperado al subir el archivo.",
        });
      }
    }
  };

  const loading = <Spinner></Spinner>;

  const success = (
    <div>
      <Paper
        elevation={10}
        square={true}
        sx={{
          padding: 3,
          marginTop: 0,
          marginBottom: 3,
          borderTop: "1px solid #eee",
          borderRadius: "0 0 10px 10px",
        }}
      >
        <StyledTooltip title="Subir y validar un archivo PDF" arrow>
          <Button
            component="label"
            variant="standard"
            color="success"
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
                  fileInfo.pages,
                )}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`ubicacion del archivo: ${fileInfo.file_path}`}
              />
            </ListItem>
            <ListItem>
              <Typography variant="h6" color="secondary">
                Informacion del documento
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2" color="text.secondary">
                Productor: {fileInfo.metadata["/Producer"]}
                <br />
                Creador: {fileInfo.metadata["/Creator"]}
                <br />
                Creado:{" "}
                {getDateAndTime(fileInfo.metadata["/CreationDate"]).dateAndTime}
                <br />
                Modificado:{" "}
                {getDateAndTime(fileInfo.metadata["/ModDate"]).dateAndTime}
              </Typography>
            </ListItem>

            {fileInfo.pages
              .filter(
                (file) =>
                  `${Math.round(file.size.trimbox.width)}x${Math.round(
                    file.size.trimbox.height,
                  )}` !== calculateMostCommonSize(fileInfo.pages),
              )
              .map((file) => (
                <ListItem key={file.id + file.page_number}>
                  <ListItemText
                    primary={`Pagina: ${file.page_number}`}
                    secondary={`Tamaño: ${Math.round(
                      parseFloat(file.size.trimbox.width),
                    )} x ${Math.round(
                      parseFloat(file.size.trimbox.height),
                    )} mm`}
                  />
                </ListItem>
              ))}
          </List>
        )}
      </Paper>
    </div>
  );

  if (useError) {
    return (
      <ErrorMessage
        title={useError.title}
        message={useError.message}
        severity={useError.severity || "error"}
        action={() => setError(null)}
      />
    );
  }

  if (useLoading) {
    return <Spinner />;
  }

  if (usePlan !== "pro") {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Actualiza a nuestro plan Pro para habilitar la validación de
            archivos PDF.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return success;
}
