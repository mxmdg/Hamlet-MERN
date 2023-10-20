import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
    id: "part001",
    type: "Tapa",
    pageRange: [1, 2],
    printModAllowed: "duplex",
    minStockWeight: 170,
    maxStockWeight: 350,
    jobTypes: ["Libro", "Revista", "Anillado", "Cosido a Hilo"],
  },
  {
    id: "part002",
    type: "Contratapa",
    pageRange: [1, 2],
    printModAllowed: "duplex",
    minStockWeight: 170,
    maxStockWeight: 350,
    jobTypes: ["Libro", "Revista", "Anillado", "Cosido a Hilo"],
  },
  {
    id: "part003",
    type: "Interior Binder",
    pageRange: [20, 1200],
    printModAllowed: "duplex",
    minStockWeight: 65,
    maxStockWeight: 170,
    jobTypes: ["Libro"],
  },
  {
    id: "part004",
    type: "Interior Cosido",
    pageRange: [24, 1200],
    printModAllowed: "duplex",
    minStockWeight: 65,
    maxStockWeight: 150,
    jobTypes: ["Cosido a Hilo"],
  },
  {
    id: "part005",
    type: "Interior Anillado",
    pageRange: [8, 900],
    printModAllowed: "duplex",
    minStockWeight: 65,
    maxStockWeight: 350,
    jobTypes: ["Anillado"],
  },
  {
    id: "part006",
    type: "Interior Revista",
    pageRange: [4, 72],
    printModAllowed: "duplex",
    minStockWeight: 65,
    maxStockWeight: 300,
    jobTypes: ["Revista"],
  },
  {
    id: "part007",
    type: "Hojas sueltas",
    pageRange: [1, 1000000],
    printModAllowed: "duplex",
    minStockWeight: 65,
    maxStockWeight: 350,
    jobTypes: ["Sin Encuadernacion", "Multipagina"],
  },
  {
    id: "part008",
    type: "Afiche",
    pageRange: [1, 1000],
    printModAllowed: "simplex",
    minStockWeight: 65,
    maxStockWeight: 350,
    jobTypes: ["Sin Encuadernacion", "Multipagina"],
  },
  {
    id: "part009",
    type: "Señalador",
    pageRange: [1, 1000],
    printModAllowed: "duplex",
    minStockWeight: 150,
    maxStockWeight: 350,
    jobTypes: ["Sin Encuadernacion", "Multipagina", "Libro"],
  },
  {
    id: "part010",
    type: "Tarjeta",
    pageRange: [1, 1000],
    printModAllowed: "duplex",
    minStockWeight: 150,
    maxStockWeight: 350,
    jobTypes: ["Sin Encuadernacion", "Multipagina"],
  },
  {
    id: "part011",
    type: "Etiqueta",
    pageRange: [1, 1000],
    printModAllowed: "simplex",
    minStockWeight: 65,
    maxStockWeight: 350,
    jobTypes: ["Sin Encuadernacion", "Multipagina"],
  },
  {
    id: "part012",
    type: "Insert",
    pageRange: [1, 1000],
    printModAllowed: "duplex",
    minStockWeight: 65,
    maxStockWeight: 350,
    jobTypes: ["Libro", "Revista", "Anillado", "Cosido a Hilo"],
  },
  {
    id: "part013",
    type: "Diptico",
    pageRange: [1, 1000],
    printModAllowed: "duplex",
    minStockWeight: 65,
    maxStockWeight: 350,
    jobTypes: ["Sin Encuadernacion", "Multipagina"],
  },
  {
    id: "part014",
    type: "Triptico",
    pageRange: [1, 1000],
    printModAllowed: "duplex",
    minStockWeight: 65,
    maxStockWeight: 350,
    jobTypes: ["Sin Encuadernacion", "Multipagina"],
  },
  {
    id: "part015",
    type: "Folleto",
    pageRange: [1, 1000],
    printModAllowed: "duplex",
    minStockWeight: 65,
    maxStockWeight: 350,
    jobTypes: ["Sin Encuadernacion", "Multipagina"],
  },
  {
    id: "part016",
    type: "Cubierta",
    pageRange: [1, 1000],
    printModAllowed: "duplex",
    minStockWeight: 150,
    maxStockWeight: 350,
    jobTypes: ["Sin Encuadernacion", "Multipagina", "Libro"],
  },
  {
    id: "part017",
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

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

  const handleChange = (selectedValue) => {
    const part = partsList.find((item) => item.id === selectedValue);
    setCurrentPart(part);
    console.log("Current Part:");
    console.log(currentPart);
  };

  useEffect(() => {
    const updateStocks = async () => {
      await fechtData("materiales", setStocks);
      filterStocks();
    };

    const filteredParts = props.job?.JobType
      ? parts.filter((part) => part.jobTypes.includes(props.job.JobType.name))
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
        <form name="form2" action="" onSubmit={handleSubmit(props.addParts)}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 1, sm: 4, md: 8 }}
          >
            {partsList !== null && (
              <Grid item xs={1} sm={2} md={4}>
                <FormControl sx={{ width: "90%" }}>
                  <InputLabel id="demo-simple-select-label">Partes</InputLabel>
                  <Controller // Usamos Controller de react-hook-form para el Select
                    name="jobParts"
                    {...register("jobParts")}
                    control={control} // Proporcionamos el control del formulario
                    value={partsList[0].id}
                    render={({ field }) => (
                      <Select
                        label="Partes"
                        {...field} // Aseguramos que las propiedades del campo sean manejadas por react-hook-form
                        onChange={(e) => {
                          handleChange(e.target.value); // Llamamos a nuestra función handleChange
                          field.onChange(e); // Importante llamar esto para que react-hook-form actualice los valores internamente
                        }}
                      >
                        {partsList.map((part) => (
                          <MenuItem value={part.id} key={part.id}>
                            {part.type}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            )}
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                id="Pages"
                type="number"
                label="Paginas"
                variant="outlined"
                name="Pages"
                color="warning"
                {...register("Pages")}
              />
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                variant="outlined"
                type="number"
                name="Ancho"
                id="Ancho"
                label="Ancho"
                color="info"
                {...register("Ancho")}
              />
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                variant="outlined"
                type="number"
                name="Alto"
                id="Alto"
                label="Alto"
                color="error"
                {...register("Alto")}
              />
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                variant="outlined"
                type="number"
                name="ColoresFrente"
                id="ColoresFrente"
                label="Colores Frente"
                color="secondary"
                {...register("ColoresFrente")}
              />
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                variant="outlined"
                type="number"
                name="ColoresDorso"
                id="ColoresDorso"
                label="Colores Dorso"
                color="warning"
                {...register("ColoresDorso")}
              />
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <FormControl sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-label">Material</InputLabel>
                <Select
                  name="partStock"
                  id="partStock"
                  label="Material"
                  onChange={props.onChange}
                  //defaultValue={""}
                  variant="outlined"
                  sx={{ width: "95%" }}
                  color="primary"
                  {...register("partStock")}
                >
                  {filteredStocks.map((Stock) => (
                    <MenuItem value={Stock._id} id={Stock._id} key={Stock._id}>
                      {Stock.Nombre_Material}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <FormControl sx={{ width: "85%" }}>
                <Button
                  type="submit"
                  size="large"
                  variant="outlined"
                  color="secondary"
                >
                  Agregar Parte
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobParts;
