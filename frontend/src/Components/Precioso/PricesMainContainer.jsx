import Precioso from "./Precioso";
import Form from "../Formulario/Form";
import PricesDataForm from "../Formulario/PricesDataForm";
//import "../../Styles/hamlet.css";
import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { useNavigate } from "react-router-dom";
import AddFloatButton from "../General/AddFloatButton";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Fetch from "../General/Fetch";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { currencyCotization } from "../utils/generalData/numbersAndCurrencies";
import { set } from "react-hook-form";
import Spinner from "../General/Spinner";

const PricesMainContainer = () => {
  const [useNewPrice, setNewPrice] = useState(false);
  const navigate = useNavigate();
  const collection = "precios";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useTable, setTable] = useState(false);
  const [cotization, setCotization] = useState(0);
  const context = useContext(AuthContext);

  const validateAdminUser = () => {
    if (
      context.useLogin === true &&
      context.userLogged.Role.toLowerCase() === "admin"
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleChange = () => {
    setTable(!useTable);
  };

  useEffect(() => {
    const fetchCotization = async () => {
      const data = await currencyCotization("usd");
      if (data) {
        const lastCotization = data;
        setCotization(lastCotization);
      }
      setLoading(false);
    };
    try {
      fetchCotization();
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);

  const failure = <ErrorMessage message={error} />;

  const loadingComponent = <Spinner />;

  const success = (
    <Box sx={{ width: "100%" }}>
      {validateAdminUser() && (
        <Card>
          <CardHeader
            title={collection}
            subheader={
              cotization !== 0
                ? `${cotization.results[0].detalle[0].descripcion}: $ ${cotization.results[0].detalle[0].tipoCotizacion}.-`
                : "El codigo de la moneda es invalido"
            }
            action={
              <ToggleButtonGroup
                value={useTable}
                exclusive
                onChange={handleChange}
              >
                <ToggleButton value="list" aria-label="list">
                  <ViewListIcon />
                </ToggleButton>
                <ToggleButton value="module" aria-label="module">
                  <ViewModuleIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            }
          />
          <CardContent>
            {useTable ? (
              <Fetch collection="precios" title="Costos" />
            ) : (
              <Precioso collection="precios" priceState={useNewPrice} />
            )}
          </CardContent>
          <CardActions>
            <AddFloatButton
              text={"Agregar " + collection}
              onclick={() => navigate(`/precios/add`)}
            />
          </CardActions>
        </Card>
      )}
    </Box>
  );

  return loading ? loadingComponent : error ? failure : success;
};

export default PricesMainContainer;
