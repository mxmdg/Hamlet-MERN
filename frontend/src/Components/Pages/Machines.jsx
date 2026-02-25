
import Fetch from "../General/Fetch";

// Material Imports
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid"

const Machines = (props) => {
  return (
    <Container sx={{width: "100%", height: "100%"}}>
        <Grid container columns={12} spaceing={2}>
            <Grid size={{ sm: 12, md: 12, lg: 6 }}>
                <Fetch collection="impresoras" />
            </Grid>
            <Grid size={{ sm: 12, md: 12, lg: 6 }}>
                <Fetch collection="Finishers" />
            </Grid>

        </Grid>
    </Container>
  );
};

export default Machines;
