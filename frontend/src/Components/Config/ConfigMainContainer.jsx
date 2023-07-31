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
      container spacing={6} 
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid item xs={12} sm={8} md={6}>
        <PricesMainContainer />
      </Grid>
      <Grid item xs={12} sm={8} md={6}>
        <FormatsMainContainer />
      </Grid >
      <Grid item xs={12} sm={8} md={6}>
        <StocksMainContainer />
      </Grid >
      <Grid item xs={12} sm={8} md={6}>
        <PrintersMainContainer />{" "}
      </Grid >
    </Grid>
  );
};

export default ConfigMainContainer;
