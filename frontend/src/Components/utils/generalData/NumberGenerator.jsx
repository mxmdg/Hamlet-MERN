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

const NumberGenerator = (props) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [digits, setDigits] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [useColor, setColor] = useState(props.color || "primary");

  const handleGenerate = () => {
    const startNum = parseInt(start);
    const endNum = parseInt(end);
    const digitCount = parseInt(digits);

    if (isNaN(startNum) || isNaN(endNum) || isNaN(digitCount)) {
      alert("Por favor, ingrese valores válidos.");
      return;
    }

    let content = "";
    for (let i = startNum; i <= endNum; i++) {
      content += String(i).padStart(digitCount, "0") + "\n";
    }
    setFileContent(content);

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Numerador del ${String(startNum).padStart(
      digitCount,
      "0"
    )} al ${String(endNum).padStart(digitCount, "0")}.txt`;
    a.click();
  };

  return (
    <Card elevation={10}>
     
      <CardHeader title="Numerador" titleTypographyProps={{color: useColor, fontWeight: "600"}}></CardHeader>
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Número inicial"
              type="number"
              variant="outlined"
              color={useColor}
              size="small"
              fullWidth
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Número final"
              type="number"
              variant="outlined"
              color={useColor}
              size="small"
              fullWidth
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Cantidad de dígitos"
              type="number"
              variant="outlined"
              color={useColor}
              size="small"
              fullWidth
              value={digits}
              onChange={(e) => setDigits(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              variant="outlined"
              color={useColor}
              size="large"
              onClick={handleGenerate}
            >
              Generar Archivo
            </Button>
          </Grid>
          {fileContent && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color={useColor}>
                Archivo generado con éxito.
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default NumberGenerator;
