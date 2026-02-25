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

const ImpositionDraw = (props) => {
  const context = useContext(ImpoContext);
  const canvasRef = useRef(null);
  const [useData, setData] = useState(props.data);
  const dataRef = useRef(useData);
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
      const sheet = { width: data.widthSheet, height: data.heightSheet };

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
      //console.log(data);

      drawOptimusCutting(
        parseInt(data.widthSheet),
        parseInt(data.heightSheet),
        parseInt(data.widthPage),
        parseInt(data.heightPage),
        parseInt(data.margenes),
        parseInt(data.Calle),
        newContext,
        useCanvasSize.x,
        useCanvasSize.y,
      );
    }
  };

  useEffect(() => {
    // Redimensionar el canvas al montar el componente
    handleResize();
    handleImpoClick(props.data);

    // Event listener para redimensionar el canvas en función del tamaño del navegador
    window.addEventListener("resize", handleResize);

    // Limpieza del event listener al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [props.data]);

  return (
    <CardContent>
      <Grid
        container
        spacing={0}
        columns={12}
        sx={{
          padding: "1%",
          borderRadius: "5px",
          maxHeight: "80vh",
        }}
        minWidth={200}
      >
        <Grid size={{ xs: 12, sm: 12 }}>
          <canvas
            ref={canvasRef}
            width={useCanvasSize.x}
            height={useCanvasSize.y}
            style={{
              padding: "15px",
              border: "#666 1px solid",
              borderRadius: "5px",
              width: "90%",
            }}
          ></canvas>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ImpositionDraw;
