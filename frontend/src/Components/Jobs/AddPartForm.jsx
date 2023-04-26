import JobParts from "./JobsParts"

const AddPartForm = (props)=>{

    //console.log(props.stocks)

    return (
        <>
        <fieldset className="fieldset">
            <legend className="legend">Parte</legend>
            <JobParts onChange={props.onChange}/>
            <div>
                <label htmlFor="pages">Páginas</label>
                <input type="number" name='pages'/>
            </div>
            <div>
                <label htmlFor="frontColors">Colores Frente</label>
               <select name="frontColors" id="frontColors">
                    <option value="0">Sin impresion</option>
                    <option value="1">Negro</option>
                    <option value="4">CMYK</option>
               </select>
               <label htmlFor="backColors">Colores Dorso</label>
               <select name="backColors" id="backColors">
                    <option value="0">Sin impresion</option>
                    <option value="1">Negro</option>
                    <option value="4">CMYK</option>
               </select>
            </div>
            <div>
                <label htmlFor="stockSelector">Material</label>
                <select name="stockSelector"
                    onChange={(e)=>console.log(e.target.value.Tipo, e.target.value.Gramaje)}>
                    {props.stocks.map(stock => (
                        <option key={stock._id} value={stock}>{stock.Tipo} {stock.Gramaje}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="ancho">Ancho (mm)</label>
                <input type="number" name="ancho"/><br />
                <label htmlFor="alto">Alto  (mm)</label>
                <input type="number" name="alto"/>
            </div>
        </fieldset>
        </>
    )

}
    
export default AddPartForm