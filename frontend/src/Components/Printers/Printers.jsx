import React, { useState, useEffect } from 'react';
import axios from 'axios'
import PrinterDetails from './PrinterDetails';
import './printers.css'

const readPrinters = async () => {
    const res = await axios.get("http://localhost:5000/hamlet/impresoras")
                return (res.data)
}

const Printers = ()=> {
    
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

    return (
        <div className="printersMainContainer">
            {/* Renderiza la lista de impresoras */}
            {printerList.map(printer => (
                <PrinterDetails pd={printer} key={printer._id}/>
            ))}
        </div>
    )
}

export default Printers