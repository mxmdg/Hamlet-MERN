import React, { useState, useEffect } from 'react';
import axios from 'axios'
import PrinterDetails from './PrinterDetails';
import PrintersDataForm from '../Formulario/PrintersDataForm';
import './printers.css'
import ItemsDetails from '../Formats/itemsDetails';
import { serverURL } from '../../config';

const readPrinters = async () => {
    const res = await axios.get(`${serverURL}/hamlet/impresoras`)
                return (res.data)
}

const Printers = (props)=> {
    
    const [printerList , setPrinterList] = useState([])
    
    useEffect(()=> {
        const fetchData = async () => {
            try {
                setPrinterList(await readPrinters())
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])

    return (<>
        <div className="printersMainContainer">
            {/* Renderiza la lista de impresoras */}
            {printerList.map(printer => (
                <ItemsDetails pd={printer} key={printer._id} id={printer._id} collection={props.collection} formData={PrintersDataForm}/>
            ))}
        </div>
        <div className="printersMainContainer">
            {/* Renderiza la lista de impresoras */}
            {printerList.map(printer => (
                <PrinterDetails pd={printer} key={printer._id}/>
            ))}
        </div>
        
        </>)
}

export default Printers