import {useState} from 'react'
import Input from './Input'
import Select from './Select'
import Button from './Button'
import axios from 'axios'
import './form.css'

function convertirArrayAObjeto(arr) {
  return arr.reduce((obj, item) => {
    const propName = (item.nombre || item.Nombre_material || item.Modelo);
    const propValue = isNaN(item.value) ? item.value.toLowerCase() : Number(item.value);

    obj[propName] = propValue;
  
    return obj;
  }, {});
}

const Form = (props)=> {

    const [useHidden, setHidden] = useState(props.item?false:true)
    const [useItem, setItem] = useState(props.item || {})

    let dataForm = props.form

    const submitHandler = async (e, collection, id = null)=> {
      e.preventDefault()
      console.log("Form.jsx > props.id: " + useItem.data._id + " / " + id)
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
        if (id === null) {
          await axios.post("http://localhost:5000/hamlet/" + collection, formData)
        } else {
          await axios.put(`http://localhost:5000/hamlet/${collection}/${id}`, formData)
        }
        setHidden(true)
      } catch (e) {
        console.log('No se pudeo guardar' + e)
      }   
    }

    const toogleHandler = ()=> {
      setHidden(!useHidden)
    }

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
          return <Input inputName={inp.inputName} key={inp.id} type={inp.type} item={(useItem !== {})?useItem.data:''}></Input>;
        }
      };

    const hiddenTrue = (<div className='formulario'><button onClick={toogleHandler}>+</button></div>)
    
    const hiddenFalse = (<div className='formContainer'>
                            <form onSubmit={(e)=>submitHandler(e,props.collection, useItem.data._id)} className="formulario">
                                {dataForm.map((inp)=> typeOfInput(inp))}
                                <button id="submitBTN" type="submit">Enviar</button>
                                <button id="cancelBTN" type="cancel" onClick={toogleHandler}>Cancelar</button>                
                            </form>
                          </div>)

    return useHidden ? hiddenTrue : hiddenFalse
            
} 

export default Form