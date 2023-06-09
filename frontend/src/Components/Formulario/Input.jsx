const Input = (props)=> {
    
    const valueFinder = ()=> {
        for (const [key , val] of Object.entries(props.item)) {
                if (key == props.inputName) {
                        //console.log(key, val)
                        return val  
                }
            }
    }    

    const valor = props.item?valueFinder():''
    
       
    return <div id={props.id}>
            <label>{props.inputName}</label>
            <input type={props.type} placeholder={props.inputName} step={props.step} defaultValue={valor}></input>
           </div>
   }         

export default Input;