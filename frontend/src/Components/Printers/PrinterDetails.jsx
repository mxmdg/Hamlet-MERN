import "./printers.css";
import Cmyk from "./Cmyk";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverURL } from "../Config/config";

const PrinterDetails = (props) => {
  const editClickHandler = (e) => {
    setState(Edit);
  };

  const saveClickHandler = (e) => {
    e.preventDefault();
    setState(Show);
  };

  const deleteClickHandler = async (id) => {
    if (window.confirm("Estas recontra seguro de borrar esta impresora?")) {
      try {
        await axios.delete(`${serverURL}/hamlet/impresoras/${id}`);
      } catch (e) {
        alert(e);
      }
    }
  };

  const Show = (
    <div id={props.pd._id} className="frame">
      <div className="frame__title">
        <h4>{props.pd.Modelo}</h4> <h5>{props.pd.Fabricante}</h5>
      </div>

      <Cmyk colores={props.pd.Colores} />
      <h5>Colores: {props.pd.Colores}</h5>
      <h5></h5>
      <h5>PPM: {props.pd.Paginas_por_minuto}</h5>
      <h5>
        X: {props.pd.X_Minimo}-{props.pd.X_Maximo}
      </h5>
      <h5>
        Y: {props.pd.Y_Minimo}-{props.pd.Y_Maximo}
      </h5>
      {/* <button onClick={(e) => editClickHandler(props.pd._id)}>Editar</button>
      <button onClick={(e) => deleteClickHandler(props.pd._id)}>
        Eliminar
      </button> */}
    </div>
  );

  const Edit = (
    <div id={props.pd._id} className="frame">
      <div className="frame__title">
        <input type="text" placeholder={props.pd.Modelo}></input>{" "}
        <input type="text" placeholder={props.pd.Fabricante}></input>
      </div>
      <input type="number" placeholder="Colores"></input>
      <input type="number" placeholder="Paginas por minuto"></input>
      <input type="number" placeholder="Ancho Minimo"></input> -{" "}
      <input type="number" placeholder="Ancho Maximo"></input>
      <input type="number" placeholder="Alto Minimo"></input> -{" "}
      <input type="number" placeholder="Alto Maximo"></input>
      <button onClick={saveClickHandler}>Guardar</button>
    </div>
  );

  const [state, setState] = useState(Show);

  return state;
};

export default PrinterDetails;
