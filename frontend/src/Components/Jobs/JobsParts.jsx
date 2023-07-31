import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "@mui/material/Input";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Grid } from "@mui/material";
import { fechtData } from "../customHooks/FetchDataHook";

const JobParts = (props) => {
  const [stocks, setStocks] = useState([]);
  const [partsList, setPartsList] = useState(null);
  const [currentPart, setCurrentPart] = useState({});

  const parts = [
    {
      type: "Tapa",
      pageRange: [1, 2],
      printModAllowed: "duplex",
      minStockWeight: 170,
      maxStockWeight: 350,
      jobTypes: ["Libro", "Revista", "Anillado", "Cosido a Hilo"],
    },
    {
      type: "Contratapa",
      pageRange: [1, 2],
      printModAllowed: "duplex",
      minStockWeight: 170,
      maxStockWeight: 350,
      jobTypes: ["Libro", "Revista", "Anillado", "Cosido a Hilo"],
    },
    {
      type: "Interior Binder",
      pageRange: [20, 1200],
      printModAllowed: "duplex",
      minStockWeight: 65,
      maxStockWeight: 170,
      jobTypes: ["Libro"],
    },
    {
      type: "Interior Cosido",
      pageRange: [24, 1200],
      printModAllowed: "duplex",
      minStockWeight: 65,
      maxStockWeight: 150,
      jobTypes: ["Cosido a Hilo"],
    },
    {
      type: "Interior Anillado",
      pageRange: [8, 900],
      printModAllowed: "duplex",
      minStockWeight: 65,
      maxStockWeight: 350,
      jobTypes: ["Anillado"],
    },
    {
      type: "Interior Revista",
      pageRange: [4, 72],
      printModAllowed: "duplex",
      minStockWeight: 65,
      maxStockWeight: 300,
      jobTypes: ["Revista"],
    },
    {
      type: "Hojas sueltas",
      pageRange: [1, 1000000],
      printModAllowed: "duplex",
      minStockWeight: 65,
      maxStockWeight: 350,
      jobTypes: ["Sin Encuadernacion", "Multipagina"],
    },
    {
      type: "Afiche",
      pageRange: [1, 1000],
      printModAllowed: "simplex",
      minStockWeight: 65,
      maxStockWeight: 350,
      jobTypes: ["Sin Encuadernacion", "Multipagina"],
    },
    {
      type: "Señalador",
      pageRange: [1, 1000],
      printModAllowed: "duplex",
      minStockWeight: 150,
      maxStockWeight: 350,
      jobTypes: ["Sin Encuadernacion", "Multipagina"],
    },
    {
      type: "Tarjeta",
      pageRange: [1, 1000],
      printModAllowed: "duplex",
      minStockWeight: 150,
      maxStockWeight: 350,
      jobTypes: ["Sin Encuadernacion", "Multipagina"],
    },
    {
      type: "Etiqueta",
      pageRange: [1, 1000],
      printModAllowed: "simplex",
      minStockWeight: 65,
      maxStockWeight: 350,
      jobTypes: ["Sin Encuadernacion", "Multipagina"],
    },
    {
      type: "Insert",
      pageRange: [1, 1000],
      printModAllowed: "duplex",
      minStockWeight: 65,
      maxStockWeight: 350,
      jobTypes: ["Libro", "Revista", "Anillado", "Cosido a Hilo"],
    },
    {
      type: "Diptico",
      pageRange: [1, 1000],
      printModAllowed: "duplex",
      minStockWeight: 65,
      maxStockWeight: 350,
      jobTypes: ["Sin Encuadernacion", "Multipagina"],
    },
    {
      type: "Triptico",
      pageRange: [1, 1000],
      printModAllowed: "duplex",
      minStockWeight: 65,
      maxStockWeight: 350,
      jobTypes: ["Sin Encuadernacion", "Multipagina"],
    },
    {
      type: "Folleto",
      pageRange: [1, 1000],
      printModAllowed: "duplex",
      minStockWeight: 65,
      maxStockWeight: 350,
      jobTypes: ["Sin Encuadernacion", "Multipagina"],
    },
    {
      type: "Cubierta",
      pageRange: [1, 1000],
      printModAllowed: "duplex",
      minStockWeight: 150,
      maxStockWeight: 350,
      jobTypes: ["Sin Encuadernacion", "Multipagina"],
    },
    {
      type: "Guardas",
      pageRange: [1, 1000],
      printModAllowed: "duplex",
      minStockWeight: 150,
      maxStockWeight: 350,
      jobTypes: ["Libro", "Revista", "Anillado", "Cosido a Hilo"],
    },
  ];

  const onChangeHandler = (e) => {
    props.onChange(e.target.value);
  };

  useEffect(() => {
    fechtData("materiales", setStocks);
    const filteredStocks = stocks.filter((stock) => {
      if (
        stock.gramaje > currentPart.minStockWeight &&
        stock.gramaje < currentPart.maxStockWeight
      ) {
        return stock;
      }
    });

    console.table(filteredStocks);

    const filteredParts = props.jobType
      ? parts.filter((part) => part.jobTypes.includes(props.jobType.name))
      : parts;

    setStocks(filteredStocks);
    setPartsList(filteredParts);
  }, [setStocks, setPartsList]);

  return (
    <Card raised sx={{ gap: "20px", maxWidth: "600px" }} color="secondary">
      {/* <CardContent>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, sm: 4, md: 8 }}
        >
          <Grid item xs={1} sm={2} md={4}>
            <InputLabel htmlFor="jobParts">Parte</InputLabel>
            <Select
              name="jobParts"
              label="Parte"
              inputProps={{
                name: "Part",
                id: "uncontrolled-native",
              }}
              onChange={onChangeHandler}
              variant="standard"
            >
              {partsList.map((part) => (
                <MenuItem
                  value={part}
                  id={`${partsList.indexOf(part)}_jobPart`}
                  key={part.type}
                >
                  {part.type}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        <Grid item xs={1} sm={2} md={4}>
          <TextField
            id="pages"
            type="number"
            label="Paginas"
            variant="standard"
            name="pages"
          />
        </Grid>
        <Grid item xs={1} sm={2} md={4}>
          <InputLabel htmlFor="partStock">Parte</InputLabel>
          <Select
            name="partStock"
            label="Material"
            onChange={props.onChange}
            variant="standard"
          >
            {stocks.map((Stock) => (
              <MenuItem value={Stock} id={Stock._id} key={Stock._id}>
                {Stock.Nombre_Material}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </CardContent> */}
    </Card>
  );
};

export default JobParts;
