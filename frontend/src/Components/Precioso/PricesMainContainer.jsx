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
  const [cotizationEnable, setCotizationEnable] = useState(false);
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
        if (!results || results.some((result) => result instanceof Error)) {
          setCotizationEnable(false);
          throw new Error("Error fetching one or more cotizations");
        }
        setCotizations(results);
        setCotizationEnable(true);
        setLoading(false);
      } catch (error) {
        setError({ message: error.message || "Failed to fetch cotizations" });
        setLoading(false);
      }
    };

    fetchCotization(["usd", "eur", "brl"]);
  }, []);

  const failure = (
    <Container>
      <ErrorMessage
        message={error?.message || "Unknown error"}
        action={() => {
          setError(null);
          setCotizationEnable(false);
        }}
      />
    </Container>
  );

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
              cotizationEnable ? (
                cotizations.length > 0 ? (
                  cotizations
                    .map(
                      (cot) =>
                        `${
                          cot.results[0].detalle[0].descripcion
                        }: ${currencyFormat(
                          cot.results[0].detalle[0].tipoCotizacion
                        )}`
                    )
                    .join(", ")
                ) : (
                  <Container>
                    <ErrorMessage
                      message={error?.message || "Cotizaciones no disponibles"}
                      severity="info"
                      variant="outlined"
                    />
                  </Container>
                )
              ) : (
                <Container>
                  <ErrorMessage
                    message={
                      error?.message ||
                      "Cotizacion Moneda extranjera no disponible"
                    }
                    severity="info"
                    variant="standard"
                  />
                </Container>
              )
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
              <Precioso collection="precios" priceState={useNewPrice} cotization={cotizations[0] !== undefined ? cotizations[0].results[0].detalle[0].tipoCotizacion : 1}/>
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

  return loading ? loadingComponent : error !== null ? failure : success;
};

export default PricesMainContainer;
