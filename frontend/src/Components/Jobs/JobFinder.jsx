import React from "react";
import { useState, useEffect } from "react";
import { databaseURL } from "../Config/config";
import { useNavigate } from "react-router-dom";

//Mui Material Imports
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Container,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";

//Custom Components
import DarkWoodCard from "../utils/DarkWoodCard";
import FullJobsRender from "../Pages/FullJobsRender";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import Fetch from "../General/Fetch";

//Custom Hooks
import { Filter } from "../customHooks/Filter";
import { fechtData, getPrivateElements } from "../customHooks/FetchDataHook";
import { Form } from "react-router-dom";

//Datos Estadisticos
import StatsCollector from "../utils/stats/StatsCollector";
import JobsForNextDays from "../utils/stats/JobsForNextWeeks";
import JobsPerDate from "../utils/stats/JobsPerDate";
import JobsPerClient from "../utils/stats/JobsPerClient";
import JobsPerSeller from "../utils/stats/JobsPerSeller";
import JobsPerType from "../utils/stats/JobsPerType";
import JobTypes from "./JobTypes";

/*  JobFinder component allows users to search for jobs based on various properties.
    It provides a form to select properties, operators, and input queries.
*/

const JobFinder = (props) => {
  // IMPORTANTE: props.entity y props.propertiesMap deben ser provistos por el componente padre
  // props.entity: endpoint para las búsquedas (ejemplo: "jobs")
  // props.propertiesMap: array de propiedades del modelo con sus tipos y etiquetas

  const [useURL, setURL] = useState(null);
  const [useProperty, setProperty] = useState(props.propertiesMap[0]);
  const [useQuery, setQuery] = useState(null);
  const [useMax, setMax] = useState(null); // Estado para buscar rangos, este es el valor maximo, para el minimo usamos `useQuery`
  const [useQueryType, setQueryType] = useState("string");
  const [useOperator, setOperator] = useState("eq");
  const [useError, setError] = useState(null);
  const [useResponse, setResponse] = useState(null);
  const [useLoading, setLoading] = useState(true);
  const [properties, setProperties] = useState(props.propertiesMap || []);
  const navigate = useNavigate();
  const inputsVariant = props.inputsVariant || "outlined";

  const operators = [
    { value: "eq", label: "Igual" },
    { value: "ne", label: "Diferente" },
    { value: "gt", label: "Mayor que" },
    { value: "gte", label: "Mayor o igual que" },
    { value: "lt", label: "Menor que" },
    { value: "lte", label: "Menor o igual que" },
    { value: "bt", label: "Entre..." },
  ];

  const fetch = async () => {
    try {
      const stock = await getPrivateElements("materiales");
      const users = await getPrivateElements("users");
      const jobParts = await getPrivateElements("jobParts");
      const finishings = await getPrivateElements("finishers");
      const companies = await getPrivateElements("empresas");

      setResponse({
        stock,
        users,
        jobParts,
        finishings,
        companies,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
    }
    return;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Si no hay query, no buscar
    if (!useQuery || useQuery === "") {
      setURL("");
      return;
    }

    // Construir los parámetros de la URL dinámicamente
    const params = new URLSearchParams();
    params.append("Q", useQuery);
    params.append("P", useProperty.value);
    params.append("OP", useOperator);

    // Si el operador es "bt" (between), agregar el valor máximo
    if (useOperator === "bt" && useMax) {
      params.append("M", useMax);
    }

    setURL(`?${params.toString()}`);
  };

  useEffect(() => {
    try {
      fetch();
    } catch (error) {
      setError(error);
    }
  }, [setURL]);

  const urlForm = (
    <Grid container columns={12} spacing={1} width={"96%"} margin={2}>
      <Grid item xs={12} sm={12} md={12}>
        <Card elevation={6}>
          <CardContent>
            <FormControl fullWidth>
              <form name="search" onSubmit={onSubmit}>
                <FormGroup>
                  <Grid container columns={12} spacing={3} width={"100%"}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        id="url_P"
                        select
                        label={useProperty.label || "Propiedad"}
                        variant={inputsVariant}
                        placeholder={useProperty.queryLabel}
                        value={useProperty.value}
                        onChange={(e) => {
                          e.preventDefault();
                          setProperty(
                            properties.find((item) => {
                              if (item.value === e.target.value) {
                                setQueryType(item.queryType);
                                console.log(item.queryType);
                                return item;
                              }
                            })
                          );
                          setURL(null);
                        }}
                      >
                        {properties !== undefined &&
                          properties.map((item) => {
                            return (
                              <MenuItem
                                value={item.value}
                                key={item.value}
                                label={item.label}
                              >
                                {item.label}
                              </MenuItem>
                            );
                          })}
                      </TextField>
                    </Grid>
                    {useResponse !== null &&
                      useQueryType === "id" &&
                      useProperty.label === "Tipo de Parte" && (
                        <Grid item xs={12} sm={12} md={4}>
                          <TextField
                            select
                            id="queryPartType"
                            label="Tipo de Parte"
                            variant={inputsVariant}
                            color="primary"
                            fullWidth
                            onChange={(e) => {
                              setURL(null);
                              setQuery(e.target.value);
                            }}
                          >
                            {useResponse.jobParts.map((part) => (
                              <MenuItem value={part._id} key={part._id}>
                                {part.Type}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      )}
                    {useResponse !== null &&
                      useQueryType === "id" &&
                      useProperty.label === "Tipo de Trabajo" && (
                        <Grid item xs={12} sm={12} md={4}>
                          <TextField
                            select
                            id="queryJobType"
                            label="Tipo de Trabajo"
                            variant={inputsVariant}
                            color="primary"
                            fullWidth
                            onChange={(e) => {
                              setURL(null);
                              setQuery(e.target.value);
                            }}
                          >
                            {JobTypes.map((jobType) => (
                              <MenuItem value={jobType.name} key={jobType.id}>
                                {jobType.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      )}

                    {useResponse !== null &&
                      useQueryType === "id" &&
                      useProperty.label === "Material de Parte" && (
                        <Grid item xs={12} sm={12} md={4}>
                          <Autocomplete
                            id="queryStock"
                            options={useResponse.stock}
                            autoHighlight
                            autoComplete={true}
                            getOptionLabel={(option) =>
                              `${option.Tipo} ${option.Gramaje} ${option.Marca} (${option.Ancho_Resma} x ${option.Alto_Resma})`
                            }
                            onChange={(event, newValue) => {
                              if (newValue) {
                                setURL(null);
                                setQuery(newValue._id);
                              } else {
                                setQuery("");
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Material"
                                variant={inputsVariant}
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                      )}
                    {useResponse !== null &&
                      useQueryType === "id" &&
                      useProperty.label.startsWith("Acabado") && (
                        <Grid item xs={12} sm={12} md={4}>
                          <TextField
                            select
                            id="queryFinisher"
                            label="Terminacion"
                            variant={inputsVariant}
                            color="primary"
                            fullWidth
                            onChange={(e) => {
                              setURL(null);
                              setQuery(e.target.value);
                            }}
                          >
                            {useResponse.finishings.map((finisher) => (
                              <MenuItem value={finisher._id} key={finisher._id}>
                                {`${finisher.Proceso} ${finisher.Modelo} ${finisher.Fabricante}`}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      )}
                    {useResponse !== null &&
                      useQueryType === "id" &&
                      useProperty.label === "Cliente" && (
                        <Grid item xs={12} sm={12} md={4}>
                          <Autocomplete
                            id="queryCompany"
                            options={useResponse.companies}
                            autoHighlight
                            autoComplete={true}
                            getOptionLabel={(option) => option.Nombre}
                            onChange={(event, newValue) => {
                              if (newValue) {
                                setURL(null);
                                setQuery(newValue._id);
                              } else {
                                setQuery("");
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Cliente"
                                variant={inputsVariant}
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                      )}
                    {useResponse !== null &&
                      useQueryType === "id" &&
                      useProperty.label === "Representante" && (
                        <Grid item xs={12} sm={12} md={4}>
                          <TextField
                            select
                            id="queryUsers"
                            label="Representante"
                            variant={inputsVariant}
                            color="primary"
                            fullWidth
                            onChange={(e) => {
                              setURL(null);
                              setQuery(e.target.value);
                            }}
                          >
                            {useResponse.users.map((cust) => (
                              <MenuItem value={cust._id} key={cust._id}>
                                {`${cust.Name} ${cust.LastName}`}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      )}
                    {useResponse !== null && useQueryType === "string" && (
                      <Grid item xs={12} sm={12} md={4}>
                        <TextField
                          id="query"
                          variant={inputsVariant}
                          color="primary"
                          label="Buscar"
                          fullWidth
                          onChange={(e) => {
                            setURL(null);
                            setQuery(e.target.value);
                          }}
                        ></TextField>
                      </Grid>
                    )}
                    {useResponse !== null && useQueryType === "number" && (
                      <>
                        <Grid item xs={12} sm={6} md={2}>
                          <TextField
                            type="Select"
                            id="operator"
                            select
                            label="Operador"
                            variant={inputsVariant}
                            color="primary"
                            fullWidth
                            value={useOperator}
                            onChange={(e) => {
                              setURL(null);
                              setOperator(e.target.value);
                            }}
                          >
                            {operators.map((op) => (
                              <MenuItem value={op.value} key={op.value}>
                                {op.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <TextField
                            type="number"
                            id="query"
                            variant={inputsVariant}
                            color="primary"
                            label={useOperator === "bt" ? "Minimo" : "Buscar"}
                            fullWidth
                            onChange={(e) => {
                              setURL(null);
                              setQuery(e.target.value);
                            }}
                          ></TextField>
                        </Grid>
                        {useOperator === "bt" && (
                          <>
                            <Grid item xs={12} sm={6} md={2}>
                              <TextField
                                type="number"
                                id="query2"
                                variant={inputsVariant}
                                color="primary"
                                label="Maximo"
                                fullWidth
                                onBlur={(e) => {
                                  setURL(null);
                                  setMax(e.target.value);
                                }}
                              ></TextField>
                            </Grid>
                          </>
                        )}
                      </>
                    )}
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      sx={{ alignSelf: "center" }}
                    >
                      <Button type="submit" variant="contained" color="primary">
                        Buscar
                      </Button>
                    </Grid>
                  </Grid>
                </FormGroup>
              </form>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
      {useURL !== null && props.entity === "jobs/complete" && (
        <Grid container columns={12} spacing={2} width={"100%"} margin={2}>
          <Grid item xs={12} sm={12} md={12}>
            <FullJobsRender
              route={props.entity + useURL}
              settings={{ title: "Pedidos", column: "emited", order: "asc" }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <StatsCollector route={props.entity + useURL}>
              <JobsForNextDays from={60} to={60} />
              <JobsPerDate />
              <JobsPerClient rank={10} />
              <JobsPerSeller />
              <JobsPerType />
            </StatsCollector>
          </Grid>
        </Grid>
      )}
      {useURL !== null && props.entity !== "jobs/complete" && (
        <Grid item xs={12} sm={12} md={12}>
          <Fetch collection={"quotations"} subdir={useURL} />
        </Grid>
      )}
    </Grid>
  );

  const inCaseOfError = (
    <ErrorMessage
      message={useError}
      severity={"warning"}
      action={() => {
        setError(null);
      }}
    />
  );

  const inCaseOfLoading = (
    <Container>
      <Spinner />
    </Container>
  );

  return useLoading ? inCaseOfLoading : useError ? inCaseOfError : urlForm;
};

export default JobFinder;
