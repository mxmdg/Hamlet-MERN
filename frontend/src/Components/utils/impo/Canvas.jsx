import { useEffect, useState, useRef, useContext } from "react";
import { drawOptimusCutting } from "./ImpositionService";

import { ImpositionForm } from "./ImpositionForm";
import { ImpoContext } from "./ImpoContext";
import {
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
} from "@mui/material";

const Canvas = (props) => {
  const context = useContext(ImpoContext);
  const canvasRef = useRef(null);
  const [useCanvasSize, setCanvasSize] = useState({
    x: 300,
    y: 200,
  });

  const handleResize = () => {
    const canvas = canvasRef.current;
    const Parent = canvas.parentNode;

    setCanvasSize({
      x: Parent.clientWidth * 0.8,
      y: Parent.clientWidth * 0.6,
    });
  };

  const handleImpoClick = (data) => {
    if (canvasRef.current) {
      const newContext = canvasRef.current.getContext("2d");
      const canvasWidth = useCanvasSize.x;
      const canvasHeight = useCanvasSize.y;
      const sheet = {
        width: parseInt(data.widthSheet),
        height: parseInt(data.heightSheet),
      };

      // Verifica si el tamaño de la hoja es mayor que el tamaño del canvas
      if (
        parseInt(data.widthSheet) > canvasWidth ||
        parseInt(data.heightSheet) > canvasHeight
      ) {
        // Calcula el factor de escala necesario para que quepa en el canvas
        const scaleWidth = canvasWidth / parseInt(data.widthSheet);
        const scaleHeight = canvasHeight / parseInt(data.heightSheet);
        const scale = Math.min(scaleWidth, scaleHeight);

        // Escala todas las medidas en consecuencia
        data.widthSheet = Math.floor(parseInt(data.widthSheet) * scale);
        data.heightSheet = Math.floor(parseInt(data.heightSheet) * scale);
        data.widthPage = Math.floor(parseInt(data.widthPage) * scale);
        data.heightPage = Math.floor(parseInt(data.heightPage) * scale);
        data.margenes = Math.floor(parseInt(data.margenes) * scale);
        data.Calle = Math.floor(parseInt(data.Calle) * scale);
      }
      data.sheetOriginalSize = sheet;
      console.log(data);

      const totalPoses = drawOptimusCutting(
        parseInt(data.widthSheet),
        parseInt(data.heightSheet),
        parseInt(data.widthPage),
        parseInt(data.heightPage),
        parseInt(data.margenes),
        parseInt(data.Calle),
        newContext,
        useCanvasSize.x,
        useCanvasSize.y
      );

      console.log("Total Poses: " + totalPoses.tPoses);

      if (props.getPoses) {
        props.getPoses(totalPoses.tPoses);
        props.getSheet(data);
      }
    }
  };

  useEffect(() => {
    // Redimensionar el canvas al montar el componente
    handleResize();

    // Event listener para redimensionar el canvas en función del tamaño del navegador
    window.addEventListener("resize", handleResize);

    // Limpieza del event listener al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <CardHeader
        title="Imposición"
        titleTypographyProps={{ color: "primary", fontWeight: "600" }}
      />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={0}
          columns={12}
          sx={{
            padding: "1%",
            borderRadius: "5px",
          }}
          minWidth={200}
        >
          <Grid item xs={12} md={12} sm={12}>
            <ImpositionForm
              impositionSettings={props.sheet || null}
              canvasSize={useCanvasSize}
              doImposition={handleImpoClick}
              part={props.part || null}
            ></ImpositionForm>
          </Grid>

          <Divider />
          <Grid item xs={12} sm={12}>
            <canvas
              ref={canvasRef}
              width={useCanvasSize.x}
              height={useCanvasSize.y}
              style={{
                padding: "20px",
                border: "#666 1px solid",
                borderRadius: "10px",
                marginTop: "20px",
                width: "93%",
              }}
            ></canvas>
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

export default Canvas;
