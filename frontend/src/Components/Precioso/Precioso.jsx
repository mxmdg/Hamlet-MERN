import React, { useState, useEffect } from 'react';
import axios from 'axios'
import PricesDataForm from '../Formulario/PricesDataForm';
import ItemsDetails from '../Formats/itemsDetails'
import '../../Styles/hamlet.css'
import '../Stocks/Stocks.css'
import { serverURL } from '../Config/config';
import { 
    formNuvera , 
    formIgenColor , 
    formLaminado , 
    formEncuadernacion , 
    formIgenBN} 
    from './updateService';

const Precioso = (props)=> {
    const [priceList , setPriceList] = useState([])

    const getElements = async () => {
        const prices = await axios.get(`${serverURL}/hamlet/${props.collection}/`)

        let formula
        
        prices.data.map(item=>{
            switch (item.Proceso) {
                case 'nuvera':
                    formula = formNuvera(item.Valor,item.Minimo,item.Entrada)
                    break;
                case 'igen color':
                    formula = formIgenColor(item.Valor,item.Minimo,item.Entrada)
                    break;                    
                case 'laminado':
                    formula = formLaminado(item.Valor,item.Minimo,item.Entrada)
                    break;
                case 'acaballado':
                case 'pur':
                case 'eva':
                    formula = formEncuadernacion(item.Valor,item.Minimo,item.Entrada)
                    break;
                case 'igen b&n':
                    formula = formIgenBN(item.Valor,item.Minimo,item.Entrada)
                    break;
                            
            }

            console.log(formula)
        })
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
    }, [])

    return (
        <>
            <div className="printersMainContainer">
                {/* Renderiza la lista de Formatos */}
                {priceList.map(price => (
                    <ItemsDetails 
                        pd={price} 
                        collection={props.collection} 
                        key={price._id} id={price._id} 
                        formData={PricesDataForm}/>
                ))}
            </div>
        </>
        )
}

export default Precioso