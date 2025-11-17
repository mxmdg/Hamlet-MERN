import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import { CardContent } from "@mui/material";

import DarkWoodBackground from "../../img/Dark_Wood_Background.jpg";
import { Paper } from "@mui/material";

const DarkWoodCard = ({ children }) => {
  return (
    <Paper>
      <Card
        raised
        sx={{
          background: `url(${DarkWoodBackground})`,
          background: "none",
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
