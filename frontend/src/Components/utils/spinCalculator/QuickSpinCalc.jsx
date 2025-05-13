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
import { Grid, Divider } from "@mui/material";
import {
  fechtData,
  getPrivateElementByID,
} from "../../customHooks/FetchDataHook";
import Autocomplete from "@mui/material/Autocomplete";

import DarkWoodBackground from "../../../img/Dark_Wood_Background.jpg";

const QuickSpinCalc = (props) => {
  const [stocks, setStocks] = useState([]);
  const [usePages, setPages] = useState([]);
  const [useStock, selectStock] = useState([]);
  const [useSpin, setSpin] = useState("0");

  const calculateSpin = (pages, stock) => {
    if (pages && stock?.Espesor_Resma) {
      const spin = Math.ceil(
        Math.ceil(pages / 2) * (stock.Espesor_Resma / 500)
      );
      setSpin(spin);
    } else {
      setSpin("0");
    }
  };

  const handleChange = async (e) => {
    try {
      const stock = await getPrivateElementByID("materiales", e.target.value);
      selectStock(stock.data);
      calculateSpin(usePages, stock.data);
    } catch (e) {
      return { error: e.message };
    }
  };

  const handlePageChange = (e) => {
    const pages = e.target.value;
    setPages(pages);
    calculateSpin(pages, useStock);
  };

  const handleMaterialChange = (event, value) => {
    if (value) {
      selectStock(value);
      calculateSpin(usePages, value);
    }
  };

  useEffect(() => {
    const updateStocks = async () => {
      await fechtData("materiales", setStocks);
    };

    updateStocks();
  }, []);

  return (
    <Card elevation={10}>
      <CardHeader title="Calculadora de lomo" titleTypographyProps={{color: "primary", fontWeight: "600"}}></CardHeader>
      <Divider />
      <CardContent>
        <form name="form2" action="">
          <Grid
            container
            spacing={{ xs: 1, md: 2 }}
            columns={{ xs: 1, sm: 4, md: 8 }}
          >
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                id="Pages"
                type="number"
                label="Paginas"
                variant="outlined"
                name="Pages"
                color="primary"
                size="small"
                onChange={handlePageChange}
              />
            </Grid>

            <Grid item xs={1} sm={2} md={4}>
              <Autocomplete
                options={stocks}
                getOptionLabel={(option) =>
                  `${option.Nombre_Material} - ${option.Marca}`
                }
                onChange={handleMaterialChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Material"
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <Typography variant="h5" color="primary">Lomo: {useSpin} mm</Typography>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickSpinCalc;
