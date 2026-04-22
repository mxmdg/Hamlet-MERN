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

const Canvas = (props) => {
  const context = useContext(ImpoContext);
  const svgRef = useRef(null);
  const [useSvgShapes, setSvgShapes] = useState([]);
  const [useCanvasSize, setCanvasSize] = useState({
    x: 800,
    y: 450,
  });

  const handleResize = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const Parent = svg.parentNode;

    setCanvasSize({
      x: Parent.clientWidth,
      y: Parent.clientHeight * 0.9,
    });
  };

  const handleImpoClick = (data) => {
    if (svgRef.current) {
      const { context: svgContext, getShapes } = createSvgDrawingContext();
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
      //console.log(data);

      const totalPoses = drawOptimusCutting(
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

      //console.log("Total Poses: " + totalPoses.tPoses);

      if (props.getPoses) {
        props.getPoses(totalPoses.tPoses);
        props.getSheet(data);
      }
    }
    //props.save(false);
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
  }, [setCanvasSize]);

  return (
    <Box>
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
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <ImpositionForm
              impositionSettings={props.sheet || null}
              canvasSize={useCanvasSize}
              doImposition={handleImpoClick}
              part={props.part || null}
            ></ImpositionForm>
          </Grid>

          <Divider />
          <Grid size={{ xs: 12, sm: 12 }}>
            <svg
              ref={svgRef}
              width={useCanvasSize.x}
              height={useCanvasSize.y}
              viewBox={`0 0 ${useCanvasSize.x} ${useCanvasSize.y}`}
              xmlns="http://www.w3.org/2000/svg"
              style={{
                padding: "20px",
                border: "#666 1px solid",
                borderRadius: "10px",
                marginTop: "20px",
                width: "93%",
              }}
            >
              {useSvgShapes.map((shape, index) => (
                <rect
                  key={`impo-shape-${index}`}
                  x={shape.x}
                  y={shape.y}
                  rx={2}
                  ry={2}
                  width={shape.width}
                  height={shape.height}
                  fill={shape.fill}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  style={{ transition: 'all 0.5s ease-out', cursor: 'pointer' }}
                />
              ))}
            </svg>
          </Grid>
        </Grid>
      </CardContent>
    </Box>
  );
};

export default Canvas;
