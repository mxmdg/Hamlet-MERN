import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import { CardContent, CardHeader } from "@mui/material";

import DarkWoodBackground from "../../img/Dark_Wood_Background.jpg";
import { Paper } from "@mui/material";
import HamletLogo from "../../img/Logo/logo ok-01.jpg";

const DarkWoodCard = ({ children }) => {
  return (
    <Paper>
      <Card
        raised
        sx={{
          background: "#33333355",
          gap: "20px",
          width: "100%",
        }}
      >
        <CardContent>{children}</CardContent>
      </Card>
    </Paper>
  );
};

export default DarkWoodCard;
