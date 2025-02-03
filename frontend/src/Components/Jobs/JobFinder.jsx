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

const JobFinder = () => {
  const [useURL, setURL] = useState(null);
  const [useProperty, setProperty] = useState({
    value: "Nombre",
    label: "Nombre",
    queryType: "string",
  });
  const [useQuery, setQuery] = useState(null);
  const [useQueryType, setQueryType] = useState("string");
  const [useError, setError] = useState(null);
  const [useResponse, setResponse] = useState(null);
  const [useLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  const properties = [
    { value: "Nombre", label: "Nombre", queryType: "string" },
    { value: "Cantidad", label: "Cantidad", queryType: "number" },
    {
      value: "Partes.jobParts._id",
      label: "Tipo de Parte",
      queryType: "id",
      queryLabel: "jobParts.Type",
    },
    {
      value: "Partes.Name",
      label: "Nombre de Parte",
      queryType: "string",
    },
    {
      value: "Partes.Pages",
      label: "Paginas",
      queryType: "number",
      queryLabel: "Partes Pages",
    },
    {
      value: "Partes.partStock",
      label: "Material de Parte",
      queryType: "id",
      queryLabel:
        "stock.Tipo stock.Gramaje sotck.Marca (stock.Ancho_Resma x stock.Alto_Resma)",
    },
    {
      value: "Partes.Finishing",
      label: "Acabado de las partes",
      queryType: "id",
      queryLabel: "finishings.Proceso finishings.Modelo",
    },
    {
      value: "Finishing._id",
      label: "Acabado del producto",
      queryType: "id",
      queryLabel: "finishings.Proceso finishings.Modelo",
    },
    {
      value: "Owner",
      label: "Representante",
      queryType: "id",
      queryLabel: "users.Name users.LastName",
    },
    {
      value: "Company",
      label: "Cliente",
      queryType: "id",
      queryLabel: "companies.Nombre",
    },
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
    useQuery !== null 
    ? setURL(`jobs/complete?Q=${useQuery}&P=${useProperty.value}`) 
    : setURL(`jobs/complete`);
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
                        variant="outlined"
                        placeholder="Seleccionar Propiedad"
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
                        {properties.map((item) => {
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
                            variant="outlined"
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
                                variant="outlined"
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
                            variant="outlined"
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
                                variant="outlined"
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
                            variant="outlined"
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
                          variant="outlined"
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
                      <Grid item xs={12} sm={12} md={4}>
                        <TextField
                          type="number"
                          id="query"
                          variant="outlined"
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
      {useURL !== null && (
        <Grid container columns={12} spacing={2} width={"100%"} margin={2}>
          <Grid item xs={12} sm={12} md={12}>
            <FullJobsRender
              route={useURL}
              settings={{ title: "Pedidos", column: "emited", order: "asc" }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <StatsCollector route={useURL}>
              <JobsPerDate />
              <JobsForNextDays />
              <JobsPerClient rank={10} />
              <JobsPerSeller />
              <JobsPerType />
            </StatsCollector>
          </Grid>
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
