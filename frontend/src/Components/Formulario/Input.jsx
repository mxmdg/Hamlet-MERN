const Input = (props)=> {
       
    return <div id={props.id}>
            <label>{props.inputName}</label>
            <input type={props.type} placeholder={props.inputName} value={props.value} ></input>
           </div>
   }         

export default Input;