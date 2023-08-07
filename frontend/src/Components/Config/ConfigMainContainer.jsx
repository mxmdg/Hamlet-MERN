import "../../Styles/hamlet.css";
import FormatsMainContainer from "../Formats/FormatsMainContainer";
import StocksMainContainer from "../Stocks/StocksMainContainer";
import PrintersMainContainer from "../Printers/PrintersMainContainer";
import PricesMainContainer from "../Precioso/PricesMainContainer";
import Grid from "@mui/material/Grid";
import { Divider } from "@mui/material";

const ConfigMainContainer = () => {
  return (
    <Grid
      container
      spacing={6}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid item xs={12} sm={12} md={12}>
        <PricesMainContainer />
      </Grid>
    </Grid>
  );
};

export default ConfigMainContainer;
