import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import "../../Styles/hamlet.css";
import "../Stocks/Stocks.css";
import {
  Paper,
  Container,
  TextField,
  MenuItem,
  Stack,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import EnhancedTable from "./TableGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "./Spinner";
import DarkWoodCard from "../utils/DarkWoodCard";
import { useNavigate } from "react-router-dom";
import {
  fechtData,
  getPrivateElements,
  runPapyrusQuery,
} from "../customHooks/FetchDataHook";
import flattenArrayOfObjects from "../utils/flattener/flatenDicts";

// Convierte cualquier valor a string de forma segura para poder buscarlo,
// sin explotar si el dato es null, undefined, numero, booleano, objeto, etc.
const safeToString = (value) =>
  value === null || value === undefined ? "" : String(value);

const Fetch = (props) => {
  const [useList, setList] = useState([]);
  // null = no hay filtro activo (se muestra useList completa)
  const [useFilteredList, setFilteredList] = useState(null);
  const [useSelected, setSelected] = useState([]);
  const [useLoading, setLoading] = useState(true);
  const [useHeaders, setHeaders] = useState([]);
  const [useDeleted, setDeleted] = useState([]);
  const [useErrMessage, setErrMessage] = useState(null);
  const [useColumnDraft, setColumnDraft] = useState("Todo");
  const [useQueryDraft, setQueryDraft] = useState("");
  // Filtros activos. Cada uno es { id, column, query }.
  // Un item solo se muestra si CUMPLE TODOS los filtros (AND entre columnas).
  const [useFilters, setFilters] = useState([]);

  const navigate = useNavigate();

  const context = useContext(AuthContext);

  //const url = context.useSettings?.extensions?.papyrusExtractUrl;

  const orderObjectProperties = (obj, headers) => {
    const ordered = {};
    headers.forEach((h) => {
      if (obj.hasOwnProperty(h.id)) {
        ordered[h.id] = obj[h.id];
      }
    });
    return ordered;
  };

  const getElements = async () => {
    let elements;

    if (props.collection === "papyrus") {
  elements = await runPapyrusQuery(props.queryName, props.queryParams);
      } else {  
      elements = await getPrivateElements(
        props.collection + (props.subdir ? `/${props.subdir}` : ""),
      );
    }

    if (props.collection === "memberships") {
      elements = await flattenArrayOfObjects(elements);
    }

    Array.isArray(elements)
      ? setHeaders(() => {
          const arr = [];
          const labels = elements.length
            ? Object.getOwnPropertyNames(elements[0])
            : ["Error", "Datos inexistentes"];
          labels.map((e) => {
            const label =
              props.form?.find(({ inputName }) => inputName === e) || null;

            const obj = {
              id: e,
              numeric: false,
              disablePadding: false,
              label: label?.label || e,
            };
            // arr.push(obj)
            if (e !== "id" && e !== "__v") {
              arr.push(obj);
            }
          });
          const orderedElements = elements.map((e) =>
            orderObjectProperties(e, arr),
          );
          setList(orderedElements);
          return arr;
        })
      : setErrMessage(
          "Error: " + elements.response.data.message ||
            elements.message ||
            "Error desconocido",
        );

    return elements;
  };

  // Mapa id -> label, para mostrar los nombres "lindos" en el selector de columnas
  const headerLabelById = useMemo(
    () => Object.fromEntries(useHeaders.map((h) => [h.id, h.label])),
    [useHeaders],
  );

  // Aplica todos los filtros activos con AND: un item pasa solo si matchea
  // CADA filtro (cada uno puede apuntar a una columna distinta, o a "Todo").
  // Usa safeToString para que un dato null/undefined/numero/objeto no rompa la busqueda.
  useEffect(() => {
    if (useFilters.length === 0 || useList.length === 0) {
      setFilteredList(null); // sin filtro activo -> se muestra la lista completa
      return;
    }

    const allKeys = Object.keys(useList[0]);

    const results = useList.filter((item) =>
      useFilters.every((filter) => {
        const query = filter.query.toLowerCase();
        const cols = filter.column === "Todo" ? allKeys : [filter.column];
        return cols.some((col) =>
          safeToString(item[col]).toLowerCase().includes(query),
        );
      }),
    );

    setFilteredList(results);
  }, [useFilters, useList]);

  const addFilter = () => {
    const query = useQueryDraft.trim();
    if (!query) return;
    setFilters((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, column: useColumnDraft, query },
    ]);
    setQueryDraft("");
  };

  const removeFilter = (id) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getElements();
        setFilters([]);
        setLoading(false);
      } catch (err) {
        setErrMessage(err.response?.data?.message || err.message);
        setLoading(false);
        return err;
      }
    };
    fetchData();
  }, [useDeleted, props.collection]);

  const Loading = <Spinner />;

  const AlertError = (
    <ErrorMessage
      message={useErrMessage}
      severity={"warning"}
      action={() => {
        setErrMessage(null);
      }}
      title="Error consultando la base datos"
    />
  );

  const rowsToShow = useFilteredList !== null ? useFilteredList : useList;
  const sinResultados =
    useFilteredList !== null && useFilteredList.length === 0;

  const TableLoaded = (
    <>
      <DarkWoodCard>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          <TextField
            select
            label="Columna"
            value={useColumnDraft}
            onChange={(e) => setColumnDraft(e.target.value)}
            variant="filled"
            color="success"
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="Todo">Todo</MenuItem>
            {useHeaders.map((item) => (
              <MenuItem value={item.id} key={item.id}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            variant="filled"
            type="search"
            value={useQueryDraft}
            onChange={(e) => setQueryDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFilter();
              }
            }}
            placeholder="Buscar"
            color="success"
            size="small"
          ></TextField>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={addFilter}
            disabled={!useQueryDraft.trim()}
          >
            Agregar filtro
          </Button>
          {useFilters.length > 0 && (
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={() => setFilters([])}
            >
              Limpiar filtros
            </Button>
          )}
        </Stack>

        {useFilters.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 1.5 }}
          >
            {useFilters.map((filter) => (
              <Chip
                key={filter.id}
                label={`${
                  filter.column === "Todo"
                    ? "Todo"
                    : headerLabelById[filter.column] || filter.column
                }: "${filter.query}"`}
                onDelete={() => removeFilter(filter.id)}
                color="success"
                variant="outlined"
                size="small"
              />
            ))}
          </Stack>
        )}
      </DarkWoodCard>

      {sinResultados ? (
        <DarkWoodCard>
          <Typography variant="body2" sx={{ p: 1 }}>
            No se encontraron resultados con los filtros aplicados.
          </Typography>
        </DarkWoodCard>
      ) : (
        <DarkWoodCard>
          <EnhancedTable
            rows={rowsToShow}
            headCells={useHeaders}
            collection={props.collection}
            editor={setSelected}
            selected={useSelected}
            deleted={setDeleted}
          />
        </DarkWoodCard>
      )}
    </>
  );

  return useLoading ? Loading : useErrMessage ? AlertError : TableLoaded;
};

export default Fetch;
