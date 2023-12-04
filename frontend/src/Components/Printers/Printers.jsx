import React, { useState, useEffect } from "react";
import axios from "axios";
import PrinterDetails from "./PrinterDetails";
import PrintersDataForm from "../Formulario/PrintersDataForm";
// import "./printers.css";
import ItemsDetails from "../General/itemsDetails";
import { serverURL } from "../Config/config";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Spinner from "../General/Spinner";

const readPrinters = async () => {
  const res = await axios.get(`${serverURL}/hamlet/impresoras`);
  return res.data;
};

const Printers = (props) => {
  const [printerList, setPrinterList] = useState([]);
  const [useEdit, setEdit] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPrinterList(await readPrinters());
        setEdit(false);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [useEdit]);

  return (
    <Grid container spacing={3}>
      {/* Renderiza la lista de impresoras */}
      {loading ? (
        <Spinner color="warning" /> // Asegúrate de importar el componente Spinner si lo tienes
      ) : (
        printerList.map((printer) => (
          <Grid xs={12} md={4} key={printer._id}>
            <PrinterDetails
              pd={printer}
              id={printer._id}
              collection={props.collection}
              formData={PrintersDataForm}
              editor={setEdit}
            />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default Printers;
