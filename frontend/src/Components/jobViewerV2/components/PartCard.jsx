// jobViewerV2/components/PartCard.jsx
import React from "react";
import { useState, useEffect, useContext } from "react";
import { Card, CardHeader, CardContent, Typography, Box, Divider, List, ListItem,ListItemText } from "@mui/material";
import { Grid } from "@mui/material";

// Imposition imports
import { ImpoContext } from "../../utils/impo/ImpoContext";
import ImpoProvider from "../../utils/impo/ImpoContext";
import Canvas from "../../utils/impo/Canvas";
import ImpositionDraw from "../../utils/impo/ImpositionDraw";
import {
  bestCut,
  cutOptimizer,
  calculateStock,
} from "../../utils/impo/ImpositionService";
import DarkWoodCard from "../../utils/DarkWoodCard";

// Finishers
import FinishingListAuto from "../../jobViewer/FinishingListAuto";


/**
 * Renderiza UNA parte del trabajo. Componente de verdad (no función suelta).
 * Solo presenta lo que recibe por props. No baja datos, no calcula.
 * 
 * setData Sample
 *    {
          widthSheet: part.partStock.Ancho_Resma,
          heightSheet: part.partStock.Alto_Resma,
          widthPage: parseInt(useImpoData?.sheetOriginalSize?.width),
          heightPage: parseInt(useImpoData?.sheetOriginalSize?.height),
          margenes: 0,
          Calle: 0,
      }
 * 
 * 
 */
const PartCard = ({ part, index, total, impoData, cantidad }) => {
  const [usePlainsheetCutting, setPlainSheetCutting] = useState(null);
  const [ useData, setData]  = useState(impoData || null);
  const [ usePoses, setPoses] = useState(impoData?.Poses || null);

  const [ partFinishingData, setPartFinishingData ] = useState(part?.Finishing || null);


  const tipo = part?.jobParts?.[0]?.Type ?? "Parte";
  const material = part?.partStock
    ? `${part.partStock.Tipo} ${part.partStock.Gramaje}`
    : "Sin material";

  const plainSheetCuttingData = (data) => {
    const sheetCutData = {
          widthSheet: part?.partStock?.Ancho_Resma,
          heightSheet: part?.partStock?.Alto_Resma,
          widthPage: data?.sheetOriginalSize?.width,
          heightPage: data?.sheetOriginalSize?.height,
          margenes: 0,
          Calle: 0,
      }
    setPlainSheetCutting(sheetCutData);
    
    const impoResult = calculateStock(
      sheetCutData.widthPage,
      sheetCutData.heightPage,
      sheetCutData.widthSheet,
      sheetCutData.heightSheet,
      part,
      {Cantidad:parseInt(cantidad)},
      usePoses,
    )
    
    const impoData = {
      Poses: usePoses,
      totalPliegos: impoResult.cantidadDePliegos,
      impositionData: data,
      totalHojas: impoResult.totalHojas,
      tirada: impoResult.tirada,
      impresiones: impoResult.impresiones,
      pliegosPorHoja: impoResult.pliegosPorHoja,
    }

    setData(impoData);
  }

  useEffect(() => {}, [usePlainsheetCutting, useData, usePoses]);


  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <CardHeader
          title={`Parte ${index + 1} de ${total}: ${part?.Name ?? "Parte sin nombre"} (${tipo})`}
          subheader={`Páginas: ${part?.Pages ?? "—"} | Formato: ${part?.Ancho} x ${part?.Alto} | Colores: ${part?.ColoresFrente} / ${part?.ColoresDorso || "0"} | Material: ${material}`}
        />
        <Divider sx={{ my: 1 }} />
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Typography variant="h5" color="primary">
              Cómo imprimir esta parte
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <ImpoProvider>
                  <DarkWoodCard>
                    <Canvas
                      part={part}
                      getPoses={(p)=> {setPoses(p)}}
                      poses={null}
                      getSheet={(p)=> {
                        plainSheetCuttingData(p)
                        }}
                      sheet={useData?.impositionData}
                    ></Canvas>
                  </DarkWoodCard>
            </ImpoProvider>
          </Grid>
          
            {usePlainsheetCutting !== null && (
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Typography variant="h5" color="primary">Cómo obtener el material</Typography>
                  <Divider sx={{ mb: 1 }} />
                  <ImpoProvider>
                    <DarkWoodCard elevation={10}>
                      <ImpositionDraw data={usePlainsheetCutting} />
                    </DarkWoodCard>
                  </ImpoProvider>
                  <Divider sx={{ my: 1 }} />
                  <Card>
                    <CardHeader title= {`${part?.partStock?.Marca} ${part?.partStock?.Tipo} ${part?.partStock?.Gramaje} - ${useData?.impositionData?.sheetOriginalSize?.width} x ${useData?.impositionData?.sheetOriginalSize?.height}`} />
                    <List>
                      <ListItem>
                        <ListItemText primary="Poses" secondary={useData?.Poses} />
                        <ListItemText primary="Tirada" secondary={useData?.tirada} />
                        <ListItemText primary="Impresiones" secondary={useData?.impresiones} />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText primary="Pliegos" secondary={useData?.totalPliegos} />
                        <ListItemText primary="Hojas" secondary={useData?.totalHojas} />
                        <ListItemText primary="Salen por hoja" secondary={useData?.pliegosPorHoja} />
                      </ListItem>
                    </List>
                  </Card>
                  
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <FinishingListAuto 
                finishing={part.Finishing}
                        cantidad={cantidad}
                        paginas={part.Pages}
                        imposition={useData}
                        sendFinishingData={(finishingData) => {
                          setPartFinishingData((prevData) => {
                            const existingIndex = prevData.findIndex(
                              (item) => item.partId === part._id,
                            );
                            const updatedData = {
                              partId: part._id,
                              finishingData,
                            };
                            if (existingIndex !== -1) {
                              // Reemplazar el costo existente
                              const newData = [...prevData];
                              newData[existingIndex] = updatedData;
                              return newData;
                            } else {
                              // Agregar un nuevo costo
                              return [...prevData, updatedData];
                            }
                          });
                        }}
              />
            </Grid>
        </Grid>
        
      </CardContent>
    </Card>
  );
};

export default PartCard;