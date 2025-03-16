import Precioso from "./Precioso";
import Form from "../Formulario/Form";
import PricesDataForm from "../Formulario/PricesDataForm";
//import "../../Styles/hamlet.css";
import { useState } from "react";
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

const PricesMainContainer = () => {
  const [useNewPrice, setNewPrice] = useState(false);
  const navigate = useNavigate();
  const collection = "precios";
  const [loading, setLoading] = useState(true);
  const [useTable, setTable] = useState(false);
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

  return (
    <Box sx={{ width: "100%" }}>
      {validateAdminUser() && (
        <Card>
          <CardHeader
            title={collection}
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
};

export default PricesMainContainer;
