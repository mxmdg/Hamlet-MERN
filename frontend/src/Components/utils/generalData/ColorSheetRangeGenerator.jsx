import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import getColorSheetRanges from "./colorPages";
import CopyToClipboardWrapper from "../../General/CopyToClipboardWrapper";

const ColorSheetRangeGenerator = () => {
  const [pagesInput, setPagesInput] = useState("");
  const [offset, setOffset] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  // Valida el input de páginas
  const validatePagesInput = (input) => {
    // Permite espacios entre números, comas y guiones
    const regex = /^(\s*\d+\s*(-\s*\d+\s*)?\s*)(,\s*\d+\s*(-\s*\d+\s*)?\s*)*$/;
    return regex.test(input.trim());
  };

  // Valida el offset
  const validateOffset = (input) => {
    return /^-?\d+$/.test(input);
  };

  const handleGenerate = () => {
    setError("");
    if (!validatePagesInput(pagesInput)) {
      setResult("");
      setError("Formato inválido. Ejemplo válido: 3,5,7,8,10-19,23,38-44,50");
      return;
    }
    if (!validateOffset(offset)) {
      setResult("");
      setError("El offset debe ser un número entero.");
      return;
    }
    try {
      const off = parseInt(offset) || 0;
      const res = getColorSheetRanges(pagesInput.trim(), off).replace(
        /, $/,
        ""
      );
      setResult(res);
    } catch (e) {
      setResult("");
      setError("Error al procesar los datos.");
    }
  };

  return (
    <Card elevation={10}>
      <CardHeader
        title="Generador de Rangos de Hojas de Color"
        titleTypographyProps={{ color: "primary", fontWeight: "600" }}
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              label="Lista de páginas (ej: 3,5,7,8,10-19,23,38-44,50)"
              variant="outlined"
              color="primary"
              size="small"
              fullWidth
              value={pagesInput}
              onChange={(e) => {
                setPagesInput(e.target.value);
                setError("");
                setResult("");
              }}
              error={!!error}
              helperText={
                error ||
                "Separar por coma (,) y usar guión (-) para rangos consecutivos."
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Offset"
              type="number"
              variant="outlined"
              color="primary"
              size="small"
              fullWidth
              value={offset}
              onChange={(e) => {
                setOffset(e.target.value);
                setError("");
                setResult("");
              }}
              error={!!error && error.includes("offset")}
              helperText={!!error && error.includes("offset") ? error : ""}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleGenerate}
              disabled={!pagesInput || !!error}
            >
              Generar Rangos
            </Button>
          </Grid>
          {result && !error && (
            <Grid size={{ xs: 12 }}>
              <Card variant="elevation" sx={{ padding: 2 }}>
                <CardHeader
                  subheader="Copiar Rangos Generados"
                  action={
                    <CopyToClipboardWrapper
                      text={result}
                    ></CopyToClipboardWrapper>
                  }
                ></CardHeader>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {result}
                  </Typography>{" "}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ColorSheetRangeGenerator;
