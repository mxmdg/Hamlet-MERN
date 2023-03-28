const Button = (props)=> {
    const clickHandler = (e)=>{
        e.preventDefault()
        props.selectForm(props.id) 
    }

    return  <div>
                <button type={"reset"} id={props.id} onClick={clickHandler}>{props.inputName}</button>
            </div>
   }         

export default Button;