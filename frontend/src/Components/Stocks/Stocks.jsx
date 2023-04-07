import React, { useState, useEffect } from 'react';
import axios from 'axios'
import StockDataForm from '../Formulario/StockDataForm';
import ItemsDetails from '../Formats/itemsDetails';
import '../../Styles/hamlet.css'
import './Stocks.css'
import { serverURL } from '../../config';

const Stocks = (props)=> {
    const [stockList , setStockList] = useState([])
    
    useEffect(()=> {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${serverURL}/hamlet/${props.collection}`)
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
                    <ItemsDetails pd={stock} key={stock._id} id={stock._id} collection={props.collection} formData={StockDataForm}/>
                ))}
            </div>
        </>
    )
}

export default Stocks