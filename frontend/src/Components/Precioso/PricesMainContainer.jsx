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
import {
  currencyCotization,
  currencyFormat,
} from "../utils/generalData/numbersAndCurrencies";
import Spinner from "../General/Spinner";

const PricesMainContainer = () => {
  const [useNewPrice, setNewPrice] = useState(false);
  const navigate = useNavigate();
  const collection = "precios";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useTable, setTable] = useState(false);
  const [cotizations, setCotizations] = useState([]);
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
    const fetchCotization = async (codes) => {
      try {
        const results = await Promise.all(
          codes.map((code) => currencyCotization(code))
        );
        setCotizations(results);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCotization(["usd"]);
  }, []);

  const failure = <ErrorMessage message={error} />;

  const loadingComponent = <Spinner />;

  const success = (
    <Box sx={{ width: "100%" }}>
      {validateAdminUser() && (
        <Card>
          <CardHeader
            title={collection}
            subheaderTypographyProps={{
              variant: "subtitle1",
            }}
            subheader={
              cotizations.length > 0
                ? cotizations
                    .map(
                      (cot) =>
                        `${
                          cot.results[0].detalle[0].descripcion
                        }: ${currencyFormat(
                          cot.results[0].detalle[0].tipoCotizacion
                        )}`
                    )
                    .join(", ")
                : "No se encontraron cotizaciones válidas"
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
