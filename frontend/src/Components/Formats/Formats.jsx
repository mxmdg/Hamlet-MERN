import React, { useState, useEffect } from 'react';
import axios from 'axios'
import FormatsDetails from './FormatsDetails';
import '../../Styles/hamlet.css'
import '../Stocks/Stocks.css'
import { serverURL } from '../../config';

const Formats = ()=> {
    const [formatList , setFormatList] = useState([])
    
    useEffect(()=> {
        const fetchData = async () => {
            try {
                const formats = await axios.get(`${serverURL}/hamlet/formatos/`)
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
                {/* Renderiza la lista de Formatos */}
                {formatList.map(format => (
                    <FormatsDetails pd={format} key={format._id}/>
                ))}
            </div>
        </>
        )
}

export default Formats