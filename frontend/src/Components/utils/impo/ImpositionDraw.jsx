import { useEffect, useState, useRef, useContext } from "react";
import { drawOptimusCutting } from "./ImpositionService";
import { createSvgDrawingContext } from "./SvgDrawingContext";

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
  const svgRef = useRef(null);
  const [useSvgShapes, setSvgShapes] = useState([]);
  const [useData, setData] = useState(props.data);
  const dataRef = useRef(useData);
  const [useCanvasSize, setCanvasSize] = useState({
    x: 900,
    y: 600,
  });

  const handleResize = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const Parent = svg.parentNode;

    setCanvasSize({
      x: Parent.clientWidth,
      y: Parent.clientWidth * 0.9,
    });
  };

  const handleImpoClick = (data) => {
    if (svgRef.current) {
      const { context: svgContext, getShapes } = createSvgDrawingContext();
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
        svgContext,
        useCanvasSize.x,
        useCanvasSize.y,
      );
      setSvgShapes(getShapes());
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
          <svg
            ref={svgRef}
            width={useCanvasSize.x}
            height={useCanvasSize.y}
            viewBox={`0 0 ${useCanvasSize.x} ${useCanvasSize.y}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{
              padding: "15px",
              border: "#666 1px solid",
              borderRadius: "5px",
              width: "90%",
            }}
          >
            {useSvgShapes.map((shape, index) => (
              <rect
                key={`draw-shape-${index}`}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill={shape.fill}
                stroke={shape.stroke}
                strokeWidth={shape.strokeWidth}
                style={{ transition: 'all 0.5s ease-in', cursor: 'pointer' }}
              />
            ))}
          </svg>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ImpositionDraw;
