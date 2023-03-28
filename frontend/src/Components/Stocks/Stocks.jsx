import React, { useState, useEffect } from 'react';
import axios from 'axios'
import StockDetails from './StocksDetails';
import FormatsDetails from './FormatsDetails';
import '../../Styles/hamlet.css'
import './Stocks.css'

const Stocks = ()=> {
    const [stockList , setStockList] = useState([])
    const [formatList , setFormatList] = useState([])
    
    useEffect(()=> {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:5000/Hamlet/materiales")
                const formats = await axios.get("http://localhost:5000/Hamlet/formatos")
                setStockList(res.data)
                setFormatList(formats.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])

    return (
        <>
            <div className="stockMainContainer">
                {/* Renderiza la lista de materiales */}
                {stockList.map(stock => (
                    <StockDetails pd={stock} key={stock._id}/>
                ))}
            </div>
            <h3>Formatos</h3>
            <div className="stockMainContainer">
                {/* Renderiza la lista de Formatos */}
                {formatList.map(format => (
                    <FormatsDetails pd={format} key={format._id}/>
                ))}
            </div>
        </>
        )
}

export default Stocks