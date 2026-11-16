import { useEffect, useState, useRef, useContext } from "react";
import { drawOptimusCutting } from "./ImpositionService";
import { createSvgDrawingContext } from "./SvgDrawingContext";
import { ToolTipNice } from "../stats/ToolTipNice";
import { StyledTooltip } from "../../General/TableGrid";
import { swachtes } from "./ImpositionService";

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
  const [useScale, setScale] = useState(1);
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

  const handleImpoClick = (data, notify = true) => {
    if (svgRef.current) {
      const drawingData = { ...data };
      const { context: svgContext, getShapes } = createSvgDrawingContext();
      const canvasWidth = useCanvasSize.x;
      const canvasHeight = useCanvasSize.y;
      const sheet = {
        width: parseInt(drawingData.widthSheet),
        height: parseInt(drawingData.heightSheet),
      };
      const originalData = {
        ...data,
        sheetOriginalSize: sheet,
      };

      // Verifica si el tamaño de la hoja es mayor que el tamaño del canvas
      if (
        parseInt(drawingData.widthSheet) > canvasWidth ||
        parseInt(drawingData.heightSheet) > canvasHeight
      ) {
        // Calcula el factor de escala necesario para que quepa en el canvas
        const scaleWidth = canvasWidth / parseInt(drawingData.widthSheet);
        const scaleHeight = canvasHeight / parseInt(drawingData.heightSheet);
        const scale = Math.min(scaleWidth, scaleHeight);
        setScale(scale);

        // Escala todas las medidas en consecuencia
        drawingData.widthSheet = Math.floor(
          parseInt(drawingData.widthSheet) * scale,
        );
        drawingData.heightSheet = Math.floor(
          parseInt(drawingData.heightSheet) * scale,
        );
        drawingData.widthPage = Math.floor(
          parseInt(drawingData.widthPage) * scale,
        );
        drawingData.heightPage = Math.floor(
          parseInt(drawingData.heightPage) * scale,
        );
        drawingData.margenes = Math.floor(
          parseInt(drawingData.margenes || 0) * scale,
        );
        drawingData.Calle = Math.floor(
          parseInt(drawingData.Calle || 0) * scale,
        );
      }
      drawingData.sheetOriginalSize = sheet;

      const totalPoses = drawOptimusCutting(
        parseInt(drawingData.widthSheet),
        parseInt(drawingData.heightSheet),
        parseInt(drawingData.widthPage),
        parseInt(drawingData.heightPage),
        parseInt(drawingData.margenes),
        parseInt(drawingData.Calle),
        svgContext,
        useCanvasSize.x,
        useCanvasSize.y,
      );
      setSvgShapes(getShapes());

      if (notify && props.getPoses) {
        props.getPoses(totalPoses.tPoses);
        props.getSheet(originalData);
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
  }, [setCanvasSize]);

  useEffect(() => {
    if (!props.sheet) return;

    const savedSheet = props.sheet.sheetOriginalSize;
    const drawingData = {
      ...props.sheet,
      widthSheet:
        props.sheet.widthSheet ?? savedSheet?.width,
      heightSheet:
        props.sheet.heightSheet ?? savedSheet?.height,
      widthPage: props.sheet.widthPage ?? props.part?.Ancho,
      heightPage: props.sheet.heightPage ?? props.part?.Alto,
      margenes: props.sheet.margenes ?? 0,
      Calle: props.sheet.Calle ?? 0,
    };

    handleImpoClick(drawingData, false);
  }, [props.sheet, props.part?.Ancho, props.part?.Alto, useCanvasSize]);

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
                <g key={`group-shape-${index}`}>
                  <StyledTooltip
                    title={
                      index === 0
                        ? `Pliego: ${Math.ceil(shape.width / useScale)} x ${Math.ceil(shape.height / useScale)} mm`
                        : index === 1
                          ? `Área de impresión: ${Math.ceil(shape.width / useScale)} x ${Math.ceil(shape.height / useScale)} mm`
                          : `#${index - 1} | ${Math.round(shape.width / useScale)} x ${Math.round(shape.height / useScale)} mm`
                    }
                  >
                    <rect
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      fill={index === 0 ? "none" : "rgba(33, 150, 243, 0.1)"}
                      stroke={index === 0 ? "#666" : swachtes[0]}
                      strokeWidth={index === 0 ? 2 : 1}
                      // Efecto visual al pasar el mouse
                      style={{
                        cursor: index > 0 ? "crosshair" : "default",
                        transition: "all 0.5s ease-in",
                        cursor: "pointer",
                      }}
                      // Clase para hover opcional en CSS
                      className="pose-rect"
                    />
                  </StyledTooltip>

                  {/* EL HELPER (Tooltip Nativo) */}

                  {/* <title  style={{ 
                      transition: 'all 0.5s ease-in', cursor: 'pointer',
                    }}>
                    {index === 0 
                      ? `Pliego: ${shape.width}x${shape.height}mm` 
                      : `Pose #${index - 1}\nCoord: X:${Math.round(shape.x)} Y:${Math.round(shape.y)}\nTamaño: ${Math.round(shape.width)}x${Math.round(shape.height)}mm`
                    }
                  </title> */}

                  {index > 1 && (
                    <text
                      x={shape.x + shape.width / 2}
                      y={shape.y + shape.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#83a1cc"
                      fontSize={Math.min(shape.width, shape.height) / 3}
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      {index - 1}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </Grid>
        </Grid>
      </CardContent>
    </Box>
  );
};

export default Canvas;
