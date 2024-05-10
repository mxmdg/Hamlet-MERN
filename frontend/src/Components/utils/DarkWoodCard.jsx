import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import { CardContent } from "@mui/material";

import DarkWoodBackground from "../../img/Dark_Wood_Background.jpg";
import { Paper } from "@mui/material";

const DarkWoodCard = ({ children }) => {
  return (
    <Container sx={{ marginTop: "10px", marginBottom: "10px" }}>
      <Paper>
        <Card
          raised
          sx={{
            //background: `url(${DarkWoodBackground})`,
            gap: "20px",
            width: "100%",
          }}
        >
          <CardContent>{children}</CardContent>
        </Card>
      </Paper>
    </Container>
  );
};

export default DarkWoodCard;
