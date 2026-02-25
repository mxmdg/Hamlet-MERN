import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Container,
  Divider,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

// Importa aquí tus subcomponentes ya extraídos
import PartDetail from "./PartDetail";

const JobTabsView = (props) => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const [useProductionPlan, setProductionPlan] = useState({});

  const { job, previousCotizations } = props;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!job || !job.Partes) return null;

  return (
    <Box
      sx={{
        margin: 0,
        height: "100%",
      }}
    >
      <Box>
        <Card elevation={16}>
          <CardHeader
            title={`${job.Nombre} | Cantidad: ${job.Cantidad}`}
            subheader={job.Company?.Nombre || "Sin empresa"}
            action={
              <Button onClick={() => navigate(`/jobs/copy/${job._id}`)}>
                Editar
              </Button>
            }
          />

          <Divider />

          {/* Navegación por Partes */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {job.Partes.map((parte, index) => (
                <Tab
                  key={parte._id || index}
                  label={parte.Name || `Parte ${index + 1}`}
                  sx={{ fontWeight: "bold" }}
                />
              ))}
            </Tabs>
          </Box>

          <CardContent>
            {/* Contenido Dinámico de la Parte Seleccionada */}
            {job.Partes.map((parte, index) => (
              <Box key={parte._id} role="tabpanel" hidden={activeTab !== index}>
                {activeTab === index && (
                  <PartDetail
                    part={parte}
                    job={job}
                    isCotization={
                      props.cot || { impositionData: useProductionPlan }
                    } // Si viene de una cotización previa o de la cotizacion actual, de esta manera se guarda la info.
                    onSaveImposition={(id, data) => {
                      setProductionPlan((prev) => ({
                        ...prev,
                        [id]: data,
                      }));
                    }}
                    onFinishingChange={(id, data) => {
                      setProductionPlan((prev) => ({
                        ...prev,
                        ["Finishing_" + parte._id]: data,
                      }));
                    }}
                  />
                )}
              </Box>
            ))}
          </CardContent>

          <Divider />

          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              variant="outlined"
            >
              Volver
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={() => console.log(useProductionPlan)}
            >
              Plan de Producción
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default JobTabsView;
