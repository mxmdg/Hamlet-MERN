import React, { useState, useEffect } from "react";
import axios from "axios";
import FormatDataForm from "../Formulario/FormatDataForm";
import ItemsDetails from "../General/itemsDetails";
// import "../../Styles/hamlet.css";
// import "../Stocks/Stocks.css";
import { serverURL } from "../Config/config";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

const Formats = (props) => {
  const [formatList, setFormatList] = useState([]);
  const [useEdit, setEdit] = useState("");

  const getElements = async () => {
    const formats = await axios.get(`${serverURL}/hamlet/${props.collection}/`);
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
  }, [useEdit, props.formatState]);

  return (
    <>
      <Grid container spacing={3}>
        {/* Renderiza la lista de Formatos */}
        {formatList.map((format) => (
          <Grid xs={12} md={4} key={format._id}>
            <ItemsDetails
              pd={format}
              collection={props.collection}
              id={format._id}
              formData={FormatDataForm}
              editor={setEdit}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Formats;
