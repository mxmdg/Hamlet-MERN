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

import DarkWoodBackground from "../../../img/Dark_Wood_Background.jpg";

const QuickSpinCalc = (props) => {
  const [stocks, setStocks] = useState([]);
  const [usePages, setPages] = useState([]);
  const [useStock, selectStock] = useState([]);
  const [useSpin, setSpin] = useState(0);

  /* const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm(); */

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(useStock);
    const spin = Math.ceil(
      Math.ceil(usePages / 2) * (useStock.Espesor_Resma / 500)
    );
    setSpin(spin);
  };

  const handleChange = async (e) => {
    try {
      console.log(e.target.value);
      const stock = await getPrivateElementByID("materiales", e.target.value);
      console.log(stock.data);
      selectStock(stock.data);
    } catch (e) {
      return { error: e.message };
    }
  };

  const handlePageChange = (e) => {
    e.preventDefault();
    setPages(e.target.value);
  };

  useEffect(() => {
    const updateStocks = async () => {
      await fechtData("materiales", setStocks);
    };

    updateStocks();
  }, []);

  return (
    <>
      <CardHeader subheader="Calculadora de lomo"></CardHeader>
      <Divider />
      <CardContent>
        <form name="form2" action="" onSubmit={handleSubmit}>
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
                variant="filled"
                name="Pages"
                color="warning"
                size="small"
                onChange={handlePageChange}
              />
            </Grid>

            <Grid item xs={1} sm={2} md={4}>
              <FormControl sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-label">Material</InputLabel>
                <Select
                  name="partStock"
                  id="partStock"
                  label="Material"
                  onChange={handleChange}
                  defaultValue={""}
                  variant="filled"
                  sx={{ width: "95%" }}
                  color="primary"
                  size="small"
                >
                  {stocks.map((Stock) => (
                    <MenuItem value={Stock._id} id={Stock._id} key={Stock._id}>
                      {Stock.Nombre_Material} - {Stock.Marca}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={1} sm={2} md={4}>
              <TextField
                id="Spin"
                type="number"
                label="Lomo"
                variant="filled"
                name="Spin"
                value={useSpin}
                color="success"
                size="small"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <FormControl sx={{ width: "85%" }}>
                <Button
                  type="submit"
                  size="large"
                  variant="outlined"
                  color="primary"
                >
                  Lomo
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </>
  );
};

export default QuickSpinCalc;
