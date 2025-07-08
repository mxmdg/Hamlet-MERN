import React from "react";
import { Button, Card, CardActions, CardContent } from "@mui/material";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

/**
 * Wrapper reutilizable para mostrar contenido y copiarlo al portapapeles.
 * @param {Object} props
 * @param {string} props.text - El texto a mostrar y copiar
 * @param {React.ReactNode} [props.children] - Elementos opcionales a renderizar junto al botón
 */
const CopyToClipboardWrapper = ({ text, children }) => {
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleCopy = async () => {
    try {
      if (
        typeof window !== "undefined" &&
        window.navigator &&
        window.navigator.clipboard &&
        window.navigator.clipboard.writeText
      ) {
        await window.navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } else {
        throw new Error(
          "La API Clipboard no está disponible en este navegador."
        );
      }
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
      setError(err);
      setCopied(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const failure = (
    <ErrorMessage
      message={error?.message || "Error al copiar al portapapeles"}
      error={error}
      action={clearError}
      severity="warning"
    />
  );

  const success = (
    <Card>
      <CardActions>
        <IconButton
          onClick={handleCopy}
          title="Copiar al portapapeles"
          style={{ position: "absolute", right: 0, top: 0 }}
          {...(copied ? { disabled: true } : {})}
        >
          <ContentCopyIcon color={copied ? "warning" : "success"} />
        </IconButton>
      </CardActions>

      <CardContent>{children}</CardContent>
    </Card>
  );

  return error ? failure : success;
};

export default CopyToClipboardWrapper;
