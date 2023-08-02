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

export const parts = [
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
    jobTypes: ["Sin Encuadernacion", "Multipagina", "Libro"],
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

const JobParts = (props) => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [partsList, setPartsList] = useState(null);
  const [currentPart, setCurrentPart] = useState({});

  const filterStocks = () => {
    const res = stocks.filter((stock) => {
      console.log(`Gramaje del papel: ${stock.Gramaje}`);
      if (
        stock.Gramaje >= currentPart.minStockWeight &&
        stock.Gramaje <= currentPart.maxStockWeight
      ) {
        console.log(
          ` ${stock.Gramaje} esta entre ${currentPart.minStockWeight} y ${currentPart.maxStockWeight}`
        );
        return stock;
      }
      console.log();
    });
    console.log("Resultado del filtro:");
    console.table(res);
    setFilteredStocks(res);
  };

  const onChangeHandler = (e) => {
    setCurrentPart(e.target.value);
    console.log(currentPart);
    props.onChange(e.target.value);
  };

  useEffect(() => {
    const updateStocks = async () => {
      await fechtData("materiales", setStocks);
      filterStocks();
    };

    const filteredParts = props.jobType
      ? parts.filter((part) => part.jobTypes.includes(props.jobType.name))
      : parts;

    try {
      console.table(filteredParts);
      setPartsList(filteredParts);
      updateStocks();
    } catch (e) {
      console.log(e);
    }
  }, [setFilteredStocks, setPartsList, currentPart]);

  return (
    <Card raised sx={{ gap: "20px", maxWidth: "600px" }} color="secondary">
      <CardContent>
        <form name="form2" action="">
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 1, sm: 4, md: 8 }}
          >
            {partsList !== null && (
              <Grid item xs={1} sm={2} md={4}>
                <FormControl sx={{ width: "90%" }}>
                  <InputLabel id="demo-simple-select-label">Partes</InputLabel>
                  <Select
                    id="jobParts"
                    inputProps={{
                      name: "jobParts",
                      id: "jobParts",
                    }}
                    controlled={"true"}
                    variant="outlined"
                    color="primary"
                    label="Partes"
                    sx={{ width: "100%" }}
                    onChange={onChangeHandler}
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
                </FormControl>

                {/* <FormHelperText color="warning">
                Defini la parte del trabajo!
              </FormHelperText> */}
              </Grid>
            )}
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                id="pages"
                type="number"
                label="Paginas"
                variant="outlined"
                name="pages"
              />
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <FormControl sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-label">Material</InputLabel>
                <Select
                  name="partStock"
                  label="Material"
                  onChange={props.onChange}
                  defaultValue={""}
                  variant="outlined"
                  sx={{ width: "100%" }}
                >
                  {filteredStocks.map((Stock) => (
                    <MenuItem value={Stock} id={Stock._id} key={Stock._id}>
                      {Stock.Nombre_Material}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobParts;
