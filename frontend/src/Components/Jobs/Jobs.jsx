import { useState , useEffect} from 'react'
import axios from 'axios'
import { databaseURL } from '../../config'

const Jobs = ()=> {

    const [usePrinters , setPrinters ] = useState([])
    const [useStocks , setStocks] = useState([])
    const [useFormats , setFormats] = useState([])

    const fechtData = async (collection,setFunction) => {
        try { 
            const res = await axios.get(collection) 
            setFunction(res.data)
        } catch (e) {
            console.log(e)
        }       
    }
    useEffect(() => {
        fechtData('impresoras', setPrinters)
        fechtData('materiales', setStocks)
        fechtData('formatos', setFormats)
    },[])

    return (
        <div className='formulario'>
            <h3>Impresoras:</h3>
            <select >
                {usePrinters.map(printer => (
                    <option key={printer._id}>{printer.Fabricante} {printer.Modelo}</option>
                ))}
            </select>
            <h3>Materiales:</h3>
            <select>
                {useStocks.map(stock => (
                    <option key={stock._id}>{stock.Tipo} {stock.Gramaje}</option>
                ))}
            </select>
            <h3>Formatos:</h3>
            <select>
                {useFormats.map(format => (
                    <option key={format._id}>{format.Nombre}</option>
                ))}
            </select>
        </div>
    )

}

export default Jobs