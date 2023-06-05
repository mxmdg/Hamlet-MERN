import React, { useState, useEffect } from "react";
import axios from "axios";
import PrinterDetails from "./PrinterDetails";
import PrintersDataForm from "../Formulario/PrintersDataForm";
import "./printers.css";
import ItemsDetails from "../General/itemsDetails";
import { serverURL } from "../Config/config";

const readPrinters = async () => {
  const res = await axios.get(`${serverURL}/hamlet/impresoras`);
  return res.data;
};

const Printers = (props) => {
  const [printerList, setPrinterList] = useState([]);
  const [useEdit, setEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPrinterList(await readPrinters());
        setEdit(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [useEdit]);

  return (
    <>
      <div className="printersMainContainer">
        {/* Renderiza la lista de impresoras */}
        {printerList.map((printer) => (
          <ItemsDetails
            pd={printer}
            key={printer._id}
            id={printer._id}
            collection={props.collection}
            formData={PrintersDataForm}
            editor={setEdit}
          />
        ))}
      </div>
    </>
  );
};

export default Printers;
