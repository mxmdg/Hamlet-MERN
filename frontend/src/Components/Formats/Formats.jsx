import { useState, useEffect } from "react";
import axios from "axios";
import FormatDataForm from "../Formulario/FormatDataForm";
import ItemsDetails from "../General/itemsDetails";
// import "../../Styles/hamlet.css";
// import "../Stocks/Stocks.css";
import { HAMLET_API } from "../Config/config";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Spinner from "../General/Spinner";

const Formats = (props) => {
  const [formatList, setFormatList] = useState([]);
  const [useEdit, setEdit] = useState("");
  const [useLoading, setLoading] = useState(true);

  const getElements = async () => {
    const formats = await axios.get(`${HAMLET_API}/${props.collection}/`);
    setLoading(false);
    setFormatList(formats.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        getElements();
        setEdit(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [useEdit]);

  return (
    <Grid container spacing={3}>
      {/* Renderiza la lista de materiales */}
      {useLoading ? (
        <Spinner color="info" /> // Asegúrate de importar el componente Spinner si lo tienes
      ) : (
        formatList.map((format) => (
          <Grid xs={12} md={4} key={format._id}>
            <ItemsDetails
              pd={format}
              id={format._id}
              collection={props.collection}
              formData={FormatDataForm}
              editor={setEdit}
            />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default Formats;
