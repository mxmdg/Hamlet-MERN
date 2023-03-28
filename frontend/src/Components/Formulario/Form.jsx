import Input from './Input'
import Select from './Select'
import Button from './Button'
import axios from 'axios'
import './form.css'

function convertirArrayAObjeto(arr) {
  return arr.reduce((obj, item) => {
    const propName = item.nombre;
    const propValue = isNaN(item.value) ? item.value.toLowerCase() : Number(item.value);

    obj[propName] = propValue;
  
    return obj;
  }, {});
}

const submitHandler = (e, collection)=> {
  e.preventDefault()
  const datos = []
  for (let element of e.target.elements) {
    console.log(element, typeof element)
    if (element.tagName === 'INPUT' || element.tagName === 'SELECT' ) {
      let nombre = element.placeholder
      let value = element.value
      datos.push({nombre, value})
    }
  }
  const formData = convertirArrayAObjeto(datos)
  console.log(datos, formData)
  try {
    axios.post("http://localhost:5000/hamlet/" + collection, formData)
  } catch (e) {
    console.log(e)
  }
  
}

const Form = (props)=> {

    let dataForm = props.form

    const typeOfInput = (inp) => {
        if (inp.type === "Select") {
            let value
            const changeHandler = (e)=>{
                e.preventDefault()
                return value=e.target.value
            }  
          return <Select inputName={inp.inputName} key={inp.id} type={inp.type} value={value} changeHandler={changeHandler} options={inp.options}></Select>
        } else if (inp.type === "button"){
            return <Button inputName={inp.inputName} key={inp.id} type={inp.type} selectForm={props.selectForm} id={"Register"}></Button>
        } else {
          return <Input inputName={inp.inputName} key={inp.id} type={inp.type}></Input>;
        }
      };

    return <div className='formContainer'>
            <div className={"close_btn"} onClick={props.resetForms}><p>X</p></div>
            <form onSubmit={(e)=>submitHandler(e,props.collection)} className="formulario">
                {dataForm.map((inp)=> typeOfInput(inp))}
                <button id="submitBTN" type="submit">Enviar</button>
                <button id="cancelBTN" type="cancel">Cancelar</button>                
            </form>
            </div>
            
} 

export default Form