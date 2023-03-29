import React, { useState, useEffect } from 'react';
import axios from 'axios'
import StockDetails from './StocksDetails';
import '../../Styles/hamlet.css'
import './Stocks.css'

const Stocks = ()=> {
    const [stockList , setStockList] = useState([])
    
    useEffect(()=> {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:5000/Hamlet/materiales")
                setStockList(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])

    return (
        <>
            <h3>Materiales</h3>
            <div className="stockMainContainer">
                {/* Renderiza la lista de materiales */}
                {stockList.map(stock => (
                    <StockDetails pd={stock} key={stock._id}/>
                ))}
            </div>
        </>
    )
}

export default Stocks