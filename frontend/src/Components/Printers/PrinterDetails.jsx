import './printers.css'
import Cmyk from './Cmyk'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverURL } from '../../config';

const PrinterDetails = (props)=> {
    
    const editClickHandler = (e)=>{
        e.preventDefault()
        setState(Edit)
    }

    const saveClickHandler = (e)=>{
        e.preventDefault()
        setState(Show)
    }

    const deleteClickHandler = async (id)=>{
        try {
             await axios.delete(`${serverURL}/hamlet/impresoras/${id}` )
        } catch (e) {
            alert(e)
        }
    }

    const Show = (
        <div id={props.pd._id} className="frame">
            <div className="frame__title">
                <h4>{props.pd.Nombre}</h4> <h5>{props.pd.Fabricante}</h5>
            </div>
            <Cmyk colores={props.pd.Colores}/>
            <h5>PPM: {props.pd.Paginas_por_minuto}</h5>
            <h5>X: {props.pd.X_Minimo}-{props.pd.X_Maximo}</h5>
            <h5>Y: {props.pd.Y_Minimo}-{props.pd.Y_Maximo}</h5>
            <button onClick={editClickHandler}>Editar</button>
            <button onClick={()=>deleteClickHandler(props.pd._id)}>Eliminar</button>
        </div>)

        const Edit = (
            <div id={props.pd._id} className="frame">
                <div className="frame__title">
                    <input type='text' placeholder={props.pd.Nombre}></input> <input type='text' placeholder={props.pd.Fabricante}></input>
                </div>
                <input type='number' placeholder='Colores'></input>
                <input type='number' placeholder='Paginas por minuto'></input>
                <input type='number' placeholder='Ancho Minimo'></input> - <input type='number' placeholder='Ancho Maximo'></input>
                <input type='number' placeholder='Alto Minimo'></input> - <input type='number' placeholder='Alto Maximo'></input>
                <button onClick={saveClickHandler}>Guardar</button>
            </div>)    
        
    const [state, setState] = useState(Show)
    

    return state
}

export default PrinterDetails