import React, { useState, useEffect } from 'react';
import axios from 'axios'
import PricesDataForm from '../Formulario/PricesDataForm';
import ItemsDetails from '../Formats/itemsDetails'
import '../../Styles/hamlet.css'
import '../Stocks/Stocks.css'
import { serverURL } from '../Config/config';

const Precioso = (props)=> {
    const [priceList , setPriceList] = useState([])

    const getElements = async () => {
        const prices = await axios.get(`${serverURL}/hamlet/${props.collection}/`)
        setPriceList(prices.data)
    }
    
    useEffect(()=> {
        const fetchData = async () => {
            try {
                getElements()
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [priceList])

    return (
        <>
            <div className="printersMainContainer">
                {/* Renderiza la lista de Formatos */}
                {priceList.map(price => (
                    <ItemsDetails pd={price} collection={props.collection} key={price._id} id={price._id} formData={PricesDataForm}/>
                ))}
            </div>
        </>
        )
}

export default Precioso