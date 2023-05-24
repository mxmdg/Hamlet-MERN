import TextField from '@mui/material/TextField';

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
    
    /* return <TextField
                id={props.id}
                label={props.inputName}
                type={props.type}
                step={props.step}
                defaultValue={valor}
                InputLabelProps={{
                shrink: true,
                }}
                variant="filled"
        /> */
       
        return <div id={props.id}>
            <label>{props.inputName}</label>
            <input type={props.type} placeholder={props.inputName} step={props.step} defaultValue={valor}></input>
           </div>
        
   }        

export default Input;