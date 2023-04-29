import React, { useState, useEffect } from 'react';
import axios from 'axios'
import FormatDataForm from '../Formulario/FormatDataForm';
import ItemsDetails from './itemsDetails';
import '../../Styles/hamlet.css'
import '../Stocks/Stocks.css'
import { serverURL } from '../Config/config';

const Formats = (props)=> {
    const [formatList , setFormatList] = useState([])

    const getElements = async () => {
        const formats = await axios.get(`${serverURL}/hamlet/${props.collection}/`)
        setFormatList(formats.data)
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
    }, [formatList])

    return (
        <>
            <div className="printersMainContainer">
                {/* Renderiza la lista de Formatos */}
                {formatList.map(format => (
                    <ItemsDetails pd={format} collection={props.collection} key={format._id} id={format._id} formData={FormatDataForm}/>
                ))}
            </div>
        </>
        )
}

export default Formats