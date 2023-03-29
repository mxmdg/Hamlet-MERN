const Select = (props)=> {
    return <div>
                <label>{props.inputName}</label>
                <select onChange={props.changeHandler}>
                        <option>Elija una opcion</option>
                        {props.options.map((option) => (
                                <option value={option.value} id={"id_" + option.value} key={"key_" + option.value}>{option.text}</option>
                ))}
                </select>
                <div className='value' id={props.inputName + "_id"}>{props.value}</div>
        </div>
   }         

export default Select;