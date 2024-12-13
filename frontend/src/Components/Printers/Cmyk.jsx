import "./printers.css";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const Cmyk = (props) => {
  const error = (
    <ErrorMessage message={'No Ink!'} severity="warning"/>
  )
  const k = (
    <div className="cmyk">
      <div className="black"></div>
    </div>
  );
  const cmyk = (
    <div className="cmyk">
      <div className="cyan"></div>
      <div className="magenta"></div>
      <div className="yellow"></div>
      <div className="black"></div>
    </div>
  );
  const cmykPlus = (
    <div className="cmyk">
      <div className="silver"></div>
      <div className="cyan"></div>
      <div className="magenta"></div>
      <div className="yellow"></div>
      <div className="black"></div>
      <div className="pink"></div>
    </div>
  )
  //const tintas = props.colores === 1 ? k : props.colores > 4 ? cmykPlus : props.colors === 4 ? cmyk : error
  let tintas
  switch (props.colores) {
    case 1:  tintas = k
      break;
    case 4:
      tintas = cmyk
      break;  
    case 6:
      tintas = cmykPlus
      break;   
    default: 
    tintas = error
      break;
  }

  return tintas;
};

export default Cmyk;
