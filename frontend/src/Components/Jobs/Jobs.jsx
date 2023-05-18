import { useState , useEffect} from 'react'
import axios from 'axios'
import JobParts from './JobsParts'
import AddPartForm from './AddPartForm'

const Jobs = ()=> {

    const [usePrinters , setPrinters ] = useState([])
    const [useStocks , setStocks] = useState([])
    const [useFormats , setFormats] = useState([])
    const [usePart, setPart] = useState([])
    const [useOrderNumber, setOrderNumber] = useState(0)

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
        sortFormats()
        console.log(usePart)
    },[usePart])

    const sortFormats = () => {
        const formatsSorted = useFormats.sort((a, b)=> {if ( a.Nombre < b.Nombre )
                                                        return -1;
                                                        if ( a.Nombre > b.Nombre )
                                                        return 1;
                                                        return 0;
                                                        })
        return formatsSorted
    }

    return (
        <div className='formulario'>
            <h3>Nuevo Trabajo:</h3>
            <form action="newJob">
                <fieldset className='fieldset'>
                    <legend className='legend'>informacion administrativa</legend>
                    <div>
                        <label htmlFor="order">Nº de Orden</label>
                        <input type="number" name='order' defaultValue={useOrderNumber}/>
                    </div>
                    <div>
                        <label htmlFor="customer">Cliente</label>
                        <input type="text" name='customer' placeholder='Cliente'/>
                    </div>
                    <div>
                        <label htmlFor="jobName">Nomnre del trabajo</label>
                        <input type="text" name='jobName' placeholder='Nombre del trabajo'/>
                    </div>
                </fieldset>
                {(useStocks.length > 0)?<AddPartForm stocks={useStocks} onChange={setPart} partDefinition={usePart}/>:<></>}
            </form>
          
           

            <select >
                {usePrinters.map(printer => (
                    <option key={printer._id}>{printer.Fabricante} {printer.Modelo}</option>
                ))}
            </select>
            <h3>Materiales:</h3>
            <select 
                onChange={(e)=>console.log(e.target.value.Tipo, e.target.value.Gramaje)}>
                {useStocks.map(stock => (
                    <option key={stock._id} value={stock}>{stock.Tipo} {stock.Gramaje}</option>
                ))}
            </select>
            <h3>Formatos:</h3>
            <select>
                {sortFormats().map(format => (
                    <option key={format._id}>{format.Nombre}</option>
                ))}
            </select>
        </div>
    )

}

export default Jobs