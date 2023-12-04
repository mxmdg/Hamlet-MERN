import Container from "@mui/material/Container";
import Card from "@mui/material/Card";

import DarkWoodBackground from "../../img/Dark_Wood_Background.jpg";

const DarkWoodCard = ({ children }) => {
  return (
    <Container sx={{ marginTop: "10px", marginBottom: "10px" }}>
      <Card
        raised
        sx={{
          background: `url(${DarkWoodBackground})`,
          gap: "20px",
        }}
        color="secondary"
      >
        {children}
      </Card>
    </Container>
  );
};

export default DarkWoodCard;
