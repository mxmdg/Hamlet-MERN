import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import NewStackedBarChart from "./NewStackedBarChart";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
// Asegúrate de importar AMBAS funciones de tu archivo de fechas
import { getMyDate, getMyDateFromStr } from "../generalData/fechaDiccionario";
import { PapyrusStatusText } from "../PropertiesMaps/jobsMap";

const JobsForNextWeeksPapyrus = (props) => {
  const [useError, setError] = useState(null);
  const [from, setFrom] = useState(props.from || 1);
  const [to, setTo] = useState(props.to || 60);
  const [graphTitle, setGraphTitle] = useState("");

  // NUEVOS ESTADOS PARA FILTROS
  const [selectedProcesses, setSelectedProcesses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const errorRef = useRef(false);

  // 1. Obtener listas únicas de forma segura (añadiendo chequeo de existencia)
  const allProcesses = useMemo(() => {
    if (!props.jobs) return [];
    return Array.from(
      new Set(props.jobs.map((j) => j.Proceso).filter(Boolean)),
    ).sort();
  }, [props.jobs]);

  const allStatuses = useMemo(() => {
    if (!props.jobs) return [];
    return Array.from(
      new Set(props.jobs.map((j) => j.Estado).filter(Boolean)),
    ).sort();
  }, [props.jobs]);

  // 2. Inicializar procesos seleccionados al cargar los datos
  useEffect(() => {
    if (allProcesses.length > 0 && selectedProcesses.length === 0) {
      setSelectedProcesses(allProcesses);
    }
  }, [allProcesses]);

  // 3. Actualizar título cuando cambian las fechas
  useEffect(() => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - from);
    const endDate = new Date();
    endDate.setDate(today.getDate() + to);

    setGraphTitle(
      `Trabajos desde ${getMyDate(startDate).ddmmyy} al ${getMyDate(endDate).ddmmyy}`,
    );
  }, [from, to]);

  // 4. Lógica de procesamiento de datos
  let outDate = {};
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - from);
    yesterday.setHours(0, 0, 0, 0);

    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() + to);
    limitDate.setHours(23, 59, 59, 999);

    if (props.jobs) {
      for (let job of props.jobs) {
        const fechaEntrega = new Date(job.Entrega);
        const proceso = job.Proceso;
        const estado = job.Estado;
        const cantidad = parseInt(job.Cantidad) || 0;

        const cumpleFecha =
          fechaEntrega >= yesterday && fechaEntrega <= limitDate;
        const cumpleProceso = selectedProcesses.includes(proceso);
        const cumpleEstado =
          statusFilter === "TODOS" || estado === statusFilter;

        if (cumpleFecha && cumpleProceso && cumpleEstado) {
          const labelFecha = getMyDateFromStr(job.Entrega).ddmmyy;
          if (!outDate[labelFecha]) {
            outDate[labelFecha] = { name: labelFecha };
          }
          outDate[labelFecha][proceso] =
            (outDate[labelFecha][proceso] || 0) + cantidad;
        }
      }
    }
  } catch (error) {
    if (!errorRef.current) {
      errorRef.current = true;
      setError(error);
    }
  }

  const jobsPerOutDate = Object.values(outDate).sort((a, b) => {
    const [d1, m1, y1] = a.name.split("/");
    const [d2, m2, y2] = b.name.split("/");
    return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
  });

  const handleToggleProcess = (proc) => {
    setSelectedProcesses((prev) =>
      prev.includes(proc) ? prev.filter((p) => p !== proc) : [...prev, proc],
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Filtros Papyrus (SQL)
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Estado del Trabajo</InputLabel>
          <Select
            value={statusFilter}
            label="Estado del Trabajo"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="TODOS">Todos los estados</MenuItem>
            {allStatuses.map((s) => (
              <MenuItem key={s} value={s}>
                {PapyrusStatusText[s]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="caption" fontWeight="bold">
            Procesos activos:{" "}
            {`${selectedProcesses.length} de ${allProcesses.length}`}
          </Typography>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  indeterminate={
                    selectedProcesses.length > 0 &&
                    selectedProcesses.length < allProcesses.length
                  }
                  checked={
                    selectedProcesses.length === allProcesses.length &&
                    allProcesses.length > 0
                  }
                  onChange={(e) =>
                    setSelectedProcesses(e.target.checked ? allProcesses : [])
                  }
                />
              }
              label={
                <Typography variant="caption" fontWeight="bold">
                  Seleccionar Todo
                </Typography>
              }
            />
            {allProcesses.map((proc) => (
              <FormControlLabel
                key={proc}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedProcesses.includes(proc)}
                    onChange={() => handleToggleProcess(proc)}
                  />
                }
                label={<Typography variant="caption">{proc}</Typography>}
              />
            ))}
          </FormGroup>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {useError === null ? (
        <NewStackedBarChart
          data={jobsPerOutDate}
          dataKey={selectedProcesses}
          title={graphTitle || "Papyrus Data"}
          selectFrom={setFrom}
          selectTo={setTo}
          route={props.route}
        />
      ) : (
        <ErrorMessage
          message={useError.message}
          color="warning"
          action={() => {
            errorRef.current = false;
            setError(null);
          }}
        />
      )}
    </Box>
  );
};

export default JobsForNextWeeksPapyrus;
